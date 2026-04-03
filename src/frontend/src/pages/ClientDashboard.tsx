import { InvoiceStatus, ServiceRequestStatus } from "@/backend.d";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCancelServiceRequest,
  useChangePassword,
  useCreateServiceRequest,
  useGetClientServiceRequests,
  useListClientInvoices,
  useListUsers,
} from "@/hooks/useQueries";
import { clearSession, getSession, hashPassword } from "@/utils/auth";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Globe,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  UserCircle2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const WA_LINK = "https://wa.me/919901563799";

const SERVICE_TYPES = [
  "SaaS Service Management System",
  "Small Business Website Development",
  "WhatsApp Business Integration",
  "Google Business Profile Setup",
  "Security Certification Advisory",
  "Corporate Security SOP Documentation",
  "Risk Assessment Consultation",
  "Event Security Planning",
  "Police Verification Assistance",
  "UMANG App Government Services",
  "Resume Writing & Interview Prep",
  "AI Movie & Digital Content Creation",
  "Other",
];

function StatusBadge({ status }: { status: ServiceRequestStatus }) {
  if (status === ServiceRequestStatus.pending) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 gap-1.5">
        <Clock className="w-3 h-3" />
        Pending
      </Badge>
    );
  }
  if (status === ServiceRequestStatus.inProgress) {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 gap-1.5">
        <Loader2 className="w-3 h-3" />
        In Progress
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 gap-1.5">
      <CheckCircle2 className="w-3 h-3" />
      Completed
    </Badge>
  );
}

function timelineColor(status: ServiceRequestStatus): string {
  if (status === ServiceRequestStatus.pending) return "border-l-yellow-400";
  if (status === ServiceRequestStatus.inProgress) return "border-l-blue-500";
  return "border-l-green-500";
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: bigint, currency: string) {
  const num = Number(amount);
  const formatted = new Intl.NumberFormat("en-IN").format(num);
  if (currency === "INR") return `₹${formatted}`;
  return `${currency} ${formatted}`;
}

type SideTab =
  | "overview"
  | "requests"
  | "invoices"
  | "profile"
  | "notifications";

export function ClientDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time check
  useEffect(() => {
    if (!session || session.role !== "client") {
      navigate({ to: "/client-login" });
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState<SideTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    serviceType: "",
    description: "",
  });

  // Cancel request state
  const [cancelRequestId, setCancelRequestId] = useState<bigint | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Change password form
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const { mutateAsync: changePassword, isPending: changingPw } =
    useChangePassword();

  const clientUserId = session?.userId ? BigInt(session.userId) : null;
  const clientName = session?.username ?? "Client";

  const { data: requests = [], isLoading: requestsLoading } =
    useGetClientServiceRequests(clientUserId);
  const { mutateAsync: createRequest, isPending: creating } =
    useCreateServiceRequest();
  const { mutateAsync: cancelRequest, isPending: cancelling } =
    useCancelServiceRequest();

  const { data: invoices = [], isLoading: invoicesLoading } =
    useListClientInvoices(clientUserId);

  const { data: users = [] } = useListUsers();

  // ── Notification Center ────────────────────────────────────────────────────
  const notifKey = `mws_notifications_seen_${session?.userId ?? "0"}`;
  const [lastSeenTs, setLastSeenTs] = useState<number>(() => {
    const stored = localStorage.getItem(notifKey);
    return stored ? Number(stored) : 0;
  });

  // Notifications: requests that have changed to inProgress or completed after lastSeenTs
  const notifications = useMemo(() => {
    return requests
      .filter((req) => {
        if (req.status === ServiceRequestStatus.pending) return false;
        return Number(req.updatedAt) / 1_000_000 > lastSeenTs;
      })
      .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
  }, [requests, lastSeenTs]);

  const unreadCount = notifications.length;

  const handleMarkAllRead = () => {
    const now = Date.now();
    localStorage.setItem(notifKey, String(now));
    setLastSeenTs(now);
    toast.success("All notifications marked as read");
  };

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/" });
    toast.success("Logged out successfully");
  };

  const handleNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.serviceType || !requestForm.description) {
      toast.error("Please fill all fields");
      return;
    }
    if (!clientUserId) {
      toast.error("Session error. Please log in again.");
      return;
    }
    try {
      await createRequest({
        clientUserId,
        clientName,
        serviceType: requestForm.serviceType,
        description: requestForm.description,
      });
      toast.success("Service request submitted!");
      setNewRequestOpen(false);
      setRequestForm({ serviceType: "", description: "" });
    } catch {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const handleCancelRequest = async () => {
    if (!cancelRequestId) return;
    try {
      await cancelRequest(cancelRequestId);
      toast.success("Request cancelled successfully");
      setCancelDialogOpen(false);
      setCancelRequestId(null);
    } catch {
      toast.error("Failed to cancel request. Please try again.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      toast.error("Please fill all fields");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (pwForm.next.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    try {
      const [oldHash, newHash] = await Promise.all([
        hashPassword(pwForm.current),
        hashPassword(pwForm.next),
      ]);
      const clientSessionUserId = session?.userId
        ? BigInt(session.userId)
        : BigInt(1);
      const result = await changePassword({
        userId: clientSessionUserId,
        oldPasswordHash: oldHash,
        newPasswordHash: newHash,
      });
      if (result.__kind__ === "ok") {
        toast.success("Password changed successfully");
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        toast.error(result.err || "Failed to change password");
      }
    } catch {
      toast.error("Failed to change password");
    }
  };

  // Sort requests by createdAt descending (most recent first)
  const sortedRequests = [...requests].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  const pending = requests.filter(
    (r) => r.status === ServiceRequestStatus.pending,
  ).length;
  const inProgress = requests.filter(
    (r) => r.status === ServiceRequestStatus.inProgress,
  ).length;
  const completed = requests.filter(
    (r) => r.status === ServiceRequestStatus.completed,
  ).length;

  // Staff name lookup helper
  const getStaffName = (staffId: bigint | undefined) => {
    if (!staffId) return null;
    const staff = users.find((u) => u.id === staffId);
    return staff?.username ?? null;
  };

  const navItems = [
    {
      id: "overview" as SideTab,
      label: "Overview",
      icon: LayoutDashboard,
      ocid: "client_dashboard.overview.tab",
    },
    {
      id: "requests" as SideTab,
      label: "My Requests",
      icon: ClipboardList,
      ocid: "client_dashboard.requests.tab",
    },
    {
      id: "invoices" as SideTab,
      label: "Invoices",
      icon: FileText,
      ocid: "client_dashboard.invoices.tab",
    },
    {
      id: "profile" as SideTab,
      label: "Profile",
      icon: UserCircle2,
      ocid: "client_dashboard.profile.tab",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col min-h-screen border-r border-sidebar-border shadow-sm transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-sidebar-foreground">
                  My Web Solutions
                </p>
                <p className="text-xs text-sidebar-foreground/50">
                  Client Portal
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded text-sidebar-foreground/50 hover:text-sidebar-foreground"
            >
              <Menu className="w-4 h-4" />
            </button>
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

          {/* Notification Bell */}
          <button
            type="button"
            data-ocid="client_dashboard.notifications.tab"
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === "notifications"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <div className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-auto text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* WhatsApp Support Button */}
        <div className="p-3">
          <a
            href={`${WA_LINK}?text=Hi, I need support with my service.`}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="client_dashboard.whatsapp_button"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            WhatsApp Support
          </a>
        </div>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <UserCircle2 className="w-4 h-4 text-teal" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                {clientName}
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                Client Account
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
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-bold text-sm text-foreground">
            Client Portal
          </span>
        </div>
        <div className="p-4 md:p-6">
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
                  Welcome, {clientName}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Here's an overview of your services
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-display text-2xl font-bold text-foreground">
                          {requestsLoading ? "—" : pending}
                        </p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-display text-2xl font-bold text-foreground">
                          {requestsLoading ? "—" : inProgress}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          In Progress
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-display text-2xl font-bold text-foreground">
                          {requestsLoading ? "—" : completed}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Completed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Requests */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Recent Requests</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setNewRequestOpen(true)}
                      data-ocid="client_dashboard.new_request_button"
                      className="font-medium"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      New Request
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {requestsLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))}
                    </div>
                  ) : requests.length === 0 ? (
                    <div
                      data-ocid="client_dashboard.requests.empty_state"
                      className="text-center py-8"
                    >
                      <ClipboardList className="w-7 h-7 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No requests yet. Submit your first service request.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedRequests.slice(0, 3).map((req) => {
                        const staffName = getStaffName(req.assignedStaffId);
                        return (
                          <div
                            key={req.id.toString()}
                            className={`flex items-center justify-between py-2.5 border-l-4 pl-3 ${timelineColor(req.status)} rounded-r-md bg-muted/30`}
                          >
                            <div className="flex-1 min-w-0 mr-3">
                              <p className="font-medium text-sm text-foreground">
                                {req.serviceType}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {formatDate(req.createdAt)}
                              </p>
                              {staffName && (
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                  <UserCircle2 className="w-3 h-3" />
                                  Assigned: {staffName}
                                </p>
                              )}
                            </div>
                            <StatusBadge status={req.status} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card
                  className="cursor-pointer hover:shadow-card transition-all"
                  onClick={() => setNewRequestOpen(true)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          New Service Request
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submit a new request
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <a
                  href={`${WA_LINK}?text=Hi, I need support with my service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="client_dashboard.whatsapp_support_link"
                >
                  <Card className="cursor-pointer hover:shadow-card transition-all h-full">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: "#dcfce7" }}
                        >
                          <MessageCircle
                            className="w-5 h-5"
                            style={{ color: "#16a34a" }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            WhatsApp Support
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Chat with us directly
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </div>
            </motion.div>
          )}

          {/* ── My Requests ── */}
          {activeTab === "requests" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    My Service Requests
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Track all your submitted requests
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setNewRequestOpen(true)}
                  data-ocid="client_dashboard.requests.new_button"
                  className="font-medium"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  New Request
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  {requestsLoading ? (
                    <div className="p-6 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : sortedRequests.length === 0 ? (
                    <div
                      data-ocid="client_dashboard.requests.empty_state"
                      className="py-16 text-center"
                    >
                      <ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        No service requests yet.
                      </p>
                      <Button
                        size="sm"
                        className="mt-4"
                        onClick={() => setNewRequestOpen(true)}
                        data-ocid="client_dashboard.requests.empty_new_button"
                      >
                        Submit Your First Request
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {sortedRequests.map((req, index) => {
                        const staffName = getStaffName(req.assignedStaffId);
                        const isPending =
                          req.status === ServiceRequestStatus.pending;

                        return (
                          <div
                            key={req.id.toString()}
                            data-ocid={`client_dashboard.requests.item.${index + 1}`}
                            className={`p-5 flex items-start gap-4 border-l-4 ${timelineColor(req.status)}`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm text-foreground mb-1">
                                    {req.serviceType}
                                  </p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {req.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1.5">
                                    Submitted on {formatDate(req.createdAt)}
                                  </p>
                                  {staffName && (
                                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                      <UserCircle2 className="w-3 h-3" />
                                      Assigned: {staffName}
                                    </p>
                                  )}
                                </div>
                                <div className="shrink-0 flex flex-col items-end gap-2">
                                  <StatusBadge status={req.status} />
                                  {isPending && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                      data-ocid={`client_dashboard.requests.cancel_button.${index + 1}`}
                                      onClick={() => {
                                        setCancelRequestId(req.id);
                                        setCancelDialogOpen(true);
                                      }}
                                    >
                                      <X className="w-3 h-3 mr-1" />
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </div>
                              {req.staffNote && (
                                <div className="mt-2 bg-muted/50 rounded-md p-2.5">
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">
                                    Staff Note
                                  </p>
                                  <p className="text-sm text-foreground">
                                    {req.staffNote}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Invoices ── */}
          {activeTab === "invoices" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Invoices
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  View your billing history
                </p>
              </div>

              {invoicesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : invoices.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-foreground mb-2">
                      No Invoices Yet
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                      Your invoices will appear here once your services are
                      completed. For billing queries, contact us directly on
                      WhatsApp.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="font-semibold"
                      data-ocid="client_dashboard.invoices.whatsapp_button"
                    >
                      <a
                        href={`${WA_LINK}?text=Hi, I have a billing query regarding my invoice.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact on WhatsApp
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {invoices.map((invoice, index) => {
                    const isPaid = invoice.status === InvoiceStatus.paid;
                    return (
                      <Card
                        key={invoice.id.toString()}
                        data-ocid={`client_dashboard.invoices.item.${index + 1}`}
                        className={`border-l-4 ${isPaid ? "border-l-green-500" : "border-l-orange-400"}`}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-foreground mb-1">
                                {invoice.serviceType}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                                <span>
                                  Due:{" "}
                                  <span className="font-medium text-foreground">
                                    {invoice.dueDate}
                                  </span>
                                </span>
                                <span>
                                  Issued: {formatDate(invoice.createdAt)}
                                </span>
                              </div>
                              {invoice.notes && (
                                <p className="text-xs text-muted-foreground mt-1.5">
                                  {invoice.notes}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="font-display text-lg font-bold text-foreground">
                                {formatAmount(invoice.amount, invoice.currency)}
                              </p>
                              <Badge
                                className={`mt-1 ${
                                  isPaid
                                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                    : "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100"
                                }`}
                              >
                                {isPaid ? "Paid" : "Unpaid"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Notifications
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Status updates on your service requests
                  </p>
                </div>
                {notifications.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid="client_dashboard.notifications.mark_read_button"
                    onClick={handleMarkAllRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>

              {requestsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <Card>
                  <CardContent
                    data-ocid="client_dashboard.notifications.empty_state"
                    className="p-10 text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="font-medium text-sm text-foreground mb-1">
                      All caught up!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No new notifications. You'll be notified when your request
                      status changes.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {notifications.map((req, index) => {
                    const isCompleted =
                      req.status === ServiceRequestStatus.completed;
                    return (
                      <Card
                        key={req.id.toString()}
                        data-ocid={`client_dashboard.notifications.item.${index + 1}`}
                        className={`border-l-4 ${isCompleted ? "border-l-green-500" : "border-l-blue-500"}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground">
                                <span className="font-semibold">
                                  {req.serviceType}
                                </span>{" "}
                                moved to{" "}
                                <span
                                  className={
                                    isCompleted
                                      ? "text-green-600 font-semibold"
                                      : "text-blue-600 font-semibold"
                                  }
                                >
                                  {isCompleted ? "Completed" : "In Progress"}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {formatDateTime(req.updatedAt)}
                              </p>
                            </div>
                            <StatusBadge status={req.status} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Profile ── */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Profile
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage your account settings
                </p>
              </div>

              {/* Account Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {clientName}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {session?.role} Account
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ID: {session?.userId}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4 max-w-md"
                  >
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">
                        Current Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        data-ocid="client_dashboard.profile.current_password_input"
                        value={pwForm.current}
                        onChange={(e) =>
                          setPwForm((p) => ({ ...p, current: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">
                        New Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        data-ocid="client_dashboard.profile.new_password_input"
                        value={pwForm.next}
                        onChange={(e) =>
                          setPwForm((p) => ({ ...p, next: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">
                        Confirm New Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        data-ocid="client_dashboard.profile.confirm_password_input"
                        value={pwForm.confirm}
                        onChange={(e) =>
                          setPwForm((p) => ({ ...p, confirm: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      data-ocid="client_dashboard.profile.change_password_button"
                      disabled={changingPw}
                    >
                      {changingPw ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      {/* New Request Dialog */}
      <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
        <DialogContent data-ocid="client_dashboard.new_request.dialog">
          <DialogHeader>
            <DialogTitle>Submit New Service Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewRequest} className="space-y-4 pt-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Service Type *
              </Label>
              <Select
                value={requestForm.serviceType}
                onValueChange={(v) =>
                  setRequestForm((p) => ({ ...p, serviceType: v }))
                }
              >
                <SelectTrigger data-ocid="client_dashboard.new_request.service_select">
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Description *
              </Label>
              <Textarea
                data-ocid="client_dashboard.new_request.description_textarea"
                placeholder="Describe what you need..."
                rows={4}
                value={requestForm.description}
                onChange={(e) =>
                  setRequestForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                required
                className="resize-none"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="client_dashboard.new_request.cancel_button"
                onClick={() => setNewRequestOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="client_dashboard.new_request.submit_button"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Request Confirm Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent data-ocid="client_dashboard.cancel_request.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The request will be removed from
              your active requests.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="client_dashboard.cancel_request.cancel_button"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelRequestId(null);
              }}
            >
              Keep Request
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="client_dashboard.cancel_request.confirm_button"
              onClick={handleCancelRequest}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Request"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
