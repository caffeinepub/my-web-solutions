import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { clearSession, getSession } from "@/utils/auth";
import { useNavigate } from "@tanstack/react-router";
import { Globe, LayoutDashboard, LogOut, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";

export function StaffDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time check
  useEffect(() => {
    if (!session || session.role !== "staff") {
      navigate({ to: "/staff-login" });
    }
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/" });
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar flex flex-col min-h-screen">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-sidebar-foreground">
                My Web Solutions
              </p>
              <p className="text-xs text-sidebar-foreground/50">Staff Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-sidebar-primary text-sidebar-primary-foreground text-left"
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <Users className="w-4 h-4 text-teal" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                Staff Member
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                ID: {session?.userId?.slice(0, 12)}...
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="logout.button"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Overview
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Staff Dashboard
            </p>
          </div>

          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Welcome, Staff Member
                </h2>
                <p className="text-muted-foreground text-sm">
                  Your tasks and assignments will appear here once they are
                  assigned by the administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
