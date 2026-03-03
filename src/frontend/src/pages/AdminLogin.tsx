import { Role } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useQueries";
import { hashPassword, setSession } from "@/utils/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Globe, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    try {
      const passwordHash = await hashPassword(password);
      const result = await login({ username, passwordHash });
      if (result.__kind__ === "ok") {
        if (result.ok.role !== Role.admin) {
          setError("Access denied. This login is for administrators only.");
          return;
        }
        setSession({
          userId: result.ok.userId.toString(),
          role: "admin",
          username,
        });
        navigate({ to: "/admin-dashboard" });
      } else {
        setError(result.err || "Invalid credentials");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep hero-grid flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Administrator Access
          </h1>
          <p className="text-sidebar-foreground/60 text-sm">
            My Web Solutions — Admin Portal
          </p>
        </div>

        <Card className="shadow-card border-0 glass-card">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  data-ocid="admin_login.error_state"
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <Label
                  htmlFor="admin-username"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Username
                </Label>
                <Input
                  id="admin-username"
                  data-ocid="admin_login.username_input"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="admin-password"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Password
                </Label>
                <Input
                  id="admin-password"
                  data-ocid="admin_login.password_input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button
                type="submit"
                data-ocid="admin_login.submit_button"
                className="w-full font-semibold h-11"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Admin Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground/80 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
