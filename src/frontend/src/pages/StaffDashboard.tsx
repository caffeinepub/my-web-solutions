import { ServiceRequestStatus } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useListAllServiceRequests,
  useUpdateServiceRequestStatus,
} from "@/hooks/useQueries";
import { clearSession, getSession } from "@/utils/auth";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Globe,
  LayoutDashboard,
  Loader2,
  LogOut,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: ServiceRequestStatus }) {
  if (status === ServiceRequestStatus.pending) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
        Pending
      </Badge>
    );
  }
  if (status === ServiceRequestStatus.inProgress) {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
        In Progress
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
      Completed
    </Badge>
  );
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type SideTab = "overview" | "requests";

export function StaffDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time check
  useEffect(() => {
    if (!session || session.role !== "staff") {
      navigate({ to: "/staff-login" });
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState<SideTab>("overview");

  const { data: serviceRequests = [], isLoading: srLoading } =
    useListAllServiceRequests();
  const { mutate: updateStatus } = useUpdateServiceRequestStatus();

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/" });
    toast.success("Logged out successfully");
  };

  const total = serviceRequests.length;
  const pending = serviceRequests.filter(
    (r) => r.status === ServiceRequestStatus.pending,
  ).length;
  const inProgress = serviceRequests.filter(
    (r) => r.status === ServiceRequestStatus.inProgress,
  ).length;
  const completed = serviceRequests.filter(
    (r) => r.status === ServiceRequestStatus.completed,
  ).length;

  const navItems = [
    {
      id: "overview" as SideTab,
      label: "Overview",
      icon: LayoutDashboard,
      ocid: "staff_dashboard.overview_tab",
    },
    {
      id: "requests" as SideTab,
      label: "Service Requests",
      icon: ClipboardList,
      ocid: "staff_dashboard.requests_tab",
    },
  ];

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
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={item.ocid}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <Users className="w-4 h-4 text-teal" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                Staff Member
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {session?.username ?? `ID: ${session?.userId?.slice(0, 8)}...`}
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
      <main className="flex-1 p-6 overflow-auto">
        {/* ── Overview ── */}
        {activeTab === "overview" && (
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-5 pb-4 text-center">
                  <p className="font-display text-3xl font-bold text-foreground">
                    {srLoading ? "—" : total}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total Requests
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-4 text-center">
                  <p className="font-display text-3xl font-bold text-yellow-600">
                    {srLoading ? "—" : pending}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-4 text-center">
                  <p className="font-display text-3xl font-bold text-blue-600">
                    {srLoading ? "—" : inProgress}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    In Progress
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-4 text-center">
                  <p className="font-display text-3xl font-bold text-green-600">
                    {srLoading ? "—" : completed}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Requests */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {srLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : serviceRequests.length === 0 ? (
                  <div
                    data-ocid="staff_dashboard.requests.empty_state"
                    className="text-center py-8"
                  >
                    <ClipboardList className="w-7 h-7 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No service requests yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {serviceRequests.slice(0, 5).map((req) => (
                      <div
                        key={req.id.toString()}
                        className="flex items-start justify-between py-2.5 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {req.serviceType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {req.clientName} · {formatDate(req.createdAt)}
                          </p>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Service Requests ── */}
        {activeTab === "requests" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Service Requests
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage and update request statuses
              </p>
            </div>

            <Card>
              <CardContent className="p-0">
                {srLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : serviceRequests.length === 0 ? (
                  <div
                    data-ocid="staff_dashboard.requests.empty_state"
                    className="py-16 text-center"
                  >
                    <ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No service requests yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="staff_dashboard.requests.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Update</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceRequests.map((req, index) => (
                          <TableRow
                            key={req.id.toString()}
                            data-ocid={`staff_dashboard.requests.row.${index + 1}`}
                          >
                            <TableCell className="font-medium text-sm">
                              {req.clientName}
                            </TableCell>
                            <TableCell className="text-sm">
                              {req.serviceType}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">
                              {req.description}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={req.status} />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(req.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={req.status}
                                onValueChange={(v) =>
                                  updateStatus({
                                    id: req.id,
                                    status: v as ServiceRequestStatus,
                                  })
                                }
                              >
                                <SelectTrigger
                                  className="w-36 h-8 text-xs"
                                  data-ocid={`staff_dashboard.requests.status_select.${index + 1}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem
                                    value={ServiceRequestStatus.pending}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="w-3 h-3" />
                                      Pending
                                    </span>
                                  </SelectItem>
                                  <SelectItem
                                    value={ServiceRequestStatus.inProgress}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <Loader2 className="w-3 h-3" />
                                      In Progress
                                    </span>
                                  </SelectItem>
                                  <SelectItem
                                    value={ServiceRequestStatus.completed}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Completed
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
