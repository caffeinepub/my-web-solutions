import { Role } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInitAdmin, useLogin } from "@/hooks/useQueries";
import { hashPassword, setSession } from "@/utils/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  Globe,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [initDone, setInitDone] = useState(false);
  const [initStatus, setInitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const { mutateAsync: login, isPending } = useLogin();
  const { mutateAsync: initAdmin, isPending: isInitPending } = useInitAdmin();
  const navigate = useNavigate();

  // Run initAdmin on mount to ensure admin account exists with correct password hash
  useEffect(() => {
    let cancelled = false;
    const runInit = async () => {
      setInitStatus("loading");
      try {
        await initAdmin();
        if (!cancelled) {
          setInitStatus("success");
          setInitDone(true);
        }
      } catch {
        // initAdmin may not exist on older backend — gracefully degrade
        if (!cancelled) {
          setInitStatus("error");
          setInitDone(true);
        }
      }
    };
    runInit();
    return () => {
      cancelled = true;
    };
  }, [initAdmin]);

  const handleManualInit = async () => {
    setError("");
    setInitStatus("loading");
    try {
      await initAdmin();
      setInitStatus("success");
      setInitDone(true);
      setError("");
    } catch {
      setInitStatus("error");
      setInitDone(true);
      setError("Could not initialize admin account. Please try logging in.");
    }
  };

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
        const errMsg = result.err || "Invalid credentials";
        if (errMsg.toLowerCase().includes("not found")) {
          setError(
            "Admin account not found. Click the button below to initialize it.",
          );
        } else if (
          errMsg.toLowerCase().includes("password") ||
          errMsg.toLowerCase().includes("incorrect")
        ) {
          setError(
            "Invalid credentials. Ensure you are using password: Admin@123",
          );
        } else {
          setError(errMsg);
        }
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  const isBooting = initStatus === "loading" && !initDone;

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
            <AnimatePresence mode="wait">
              {isBooting ? (
                /* ── Init loading state ── */
                <motion.div
                  key="booting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  data-ocid="admin_login.loading_state"
                  className="flex flex-col items-center justify-center py-10 gap-4 text-center"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm font-medium text-foreground/80">
                    Setting up admin account…
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verifying credentials configuration
                  </p>
                </motion.div>
              ) : (
                /* ── Login form ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Init success notice */}
                  {initStatus === "success" && (
                    <div
                      data-ocid="admin_login.success_state"
                      className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      Admin account ready. Use username&nbsp;
                      <strong>admin</strong> and password&nbsp;
                      <strong>Admin@123</strong>
                    </div>
                  )}

                  {/* Error state */}
                  {error && (
                    <div
                      data-ocid="admin_login.error_state"
                      className="flex flex-col gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </div>
                      {/* Show re-init button if user not found */}
                      {error.toLowerCase().includes("not found") ||
                      error.toLowerCase().includes("initialize") ? (
                        <Button
                          type="button"
                          data-ocid="admin_login.secondary_button"
                          variant="outline"
                          size="sm"
                          className="w-full mt-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                          onClick={handleManualInit}
                          disabled={isInitPending}
                        >
                          {isInitPending ? (
                            <>
                              <Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" />
                              Initializing…
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 w-3.5 h-3.5" />
                              Initialize Admin Account
                            </>
                          )}
                        </Button>
                      ) : null}
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
                      data-ocid="admin_login.input"
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
                    disabled={isPending || isInitPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Signing In…
                      </>
                    ) : (
                      "Admin Login"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
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
