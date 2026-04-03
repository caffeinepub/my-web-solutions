import { BookingStatus, ServiceRequestStatus } from "@/backend.d";
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
import { Progress } from "@/components/ui/progress";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useAddStaffNote,
  useChangePassword,
  useGetStaffAssignedRequests,
  useListBookings,
  useUpdateServiceRequestStatus,
} from "@/hooks/useQueries";
import { clearSession, getSession, hashPassword } from "@/utils/auth";
import { useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  Globe,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Pencil,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type RequestFilterStatus = "all" | "pending" | "inProgress" | "completed";

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

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  if (status === BookingStatus.pending) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
        Pending
      </Badge>
    );
  }
  if (status === BookingStatus.confirmed) {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
        Confirmed
      </Badge>
    );
  }
  if (status === BookingStatus.completed) {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
        Completed
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
      Rejected
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

type SideTab = "overview" | "requests" | "clients" | "bookings";

// ─── Change Password Dialog ────────────────────────────────────────────────────

function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const session = getSession();
  const sessionUserId = session?.userId ? BigInt(session.userId) : BigInt(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current || !form.next || !form.confirm) {
      toast.error("Please fill all fields");
      return;
    }
    if (form.next !== form.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.next.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    try {
      const [oldHash, newHash] = await Promise.all([
        hashPassword(form.current),
        hashPassword(form.next),
      ]);
      const result = await changePassword({
        userId: sessionUserId,
        oldPasswordHash: oldHash,
        newPasswordHash: newHash,
      });
      if (result.__kind__ === "ok") {
        toast.success("Password changed successfully");
        onOpenChange(false);
        setForm({ current: "", next: "", confirm: "" });
      } else {
        toast.error(result.err || "Failed to change password");
      }
    } catch {
      toast.error("Failed to change password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="staff_dashboard.change_password.dialog">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">
              Current Password
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              data-ocid="staff_dashboard.change_password.current_input"
              value={form.current}
              onChange={(e) =>
                setForm((p) => ({ ...p, current: e.target.value }))
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
              data-ocid="staff_dashboard.change_password.new_input"
              value={form.next}
              onChange={(e) => setForm((p) => ({ ...p, next: e.target.value }))}
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
              data-ocid="staff_dashboard.change_password.confirm_input"
              value={form.confirm}
              onChange={(e) =>
                setForm((p) => ({ ...p, confirm: e.target.value }))
              }
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-ocid="staff_dashboard.change_password.cancel_button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="staff_dashboard.change_password.save_button"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Staff Note Inline Dialog ──────────────────────────────────────────────────

function StaffNoteDialog({
  open,
  onOpenChange,
  requestId,
  currentNote,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  requestId: bigint;
  currentNote: string;
}) {
  const [note, setNote] = useState(currentNote);
  const { mutateAsync: addNote, isPending } = useAddStaffNote();

  useEffect(() => {
    setNote(currentNote);
  }, [currentNote]);

  const handleSave = async () => {
    try {
      await addNote({ requestId, note });
      toast.success("Note saved");
      onOpenChange(false);
    } catch {
      toast.error("Failed to save note");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="staff_dashboard.note.dialog">
        <DialogHeader>
          <DialogTitle>Staff Note</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Textarea
            data-ocid="staff_dashboard.note.textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for this request..."
            rows={4}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            data-ocid="staff_dashboard.note.cancel_button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            data-ocid="staff_dashboard.note.save_button"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Note"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Filter Pills ──────────────────────────────────────────────────────────────

const REQUEST_FILTERS: {
  label: string;
  value: RequestFilterStatus;
  ocid: string;
}[] = [
  {
    label: "All",
    value: "all",
    ocid: "staff_dashboard.requests.filter.all",
  },
  {
    label: "Pending",
    value: "pending",
    ocid: "staff_dashboard.requests.filter.pending",
  },
  {
    label: "In Progress",
    value: "inProgress",
    ocid: "staff_dashboard.requests.filter.inprogress",
  },
  {
    label: "Completed",
    value: "completed",
    ocid: "staff_dashboard.requests.filter.completed",
  },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteRequestId, setNoteRequestId] = useState<bigint | null>(null);
  const [noteCurrentValue, setNoteCurrentValue] = useState("");
  const [requestFilter, setRequestFilter] =
    useState<RequestFilterStatus>("all");

  const staffUserId = session?.userId ? BigInt(session.userId) : null;

  const { data: serviceRequests = [], isLoading: srLoading } =
    useGetStaffAssignedRequests(staffUserId);
  const { mutate: updateStatus } = useUpdateServiceRequestStatus();
  const { data: allBookings = [], isLoading: bookingsLoading } =
    useListBookings();

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/" });
    toast.success("Logged out successfully");
  };

  const openNoteDialog = (requestId: bigint, currentNote: string) => {
    setNoteRequestId(requestId);
    setNoteCurrentValue(currentNote);
    setNoteDialogOpen(true);
  };

  const total = serviceRequests.length;
  const pendingCount = serviceRequests.filter(
    (r) => r.status === ServiceRequestStatus.pending,
  ).length;
  const inProgressCount = serviceRequests.filter(
    (r) => r.status === ServiceRequestStatus.inProgress,
  ).length;
  const completedCount = serviceRequests.filter(
    (r) => r.status === ServiceRequestStatus.completed,
  ).length;

  // Completion progress
  const completionPct =
    total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const progressColor =
    completionPct >= 75
      ? "bg-green-500"
      : completionPct >= 50
        ? "bg-blue-500"
        : "bg-yellow-500";

  // Filtered service requests
  const filteredRequests =
    requestFilter === "all"
      ? serviceRequests
      : serviceRequests.filter((r) => {
          if (requestFilter === "pending")
            return r.status === ServiceRequestStatus.pending;
          if (requestFilter === "inProgress")
            return r.status === ServiceRequestStatus.inProgress;
          if (requestFilter === "completed")
            return r.status === ServiceRequestStatus.completed;
          return true;
        });

  // Upcoming bookings: pending + confirmed only
  const upcomingBookings = allBookings.filter(
    (b) =>
      b.status === BookingStatus.pending ||
      b.status === BookingStatus.confirmed,
  );

  // Derive unique clients from assigned requests
  const clientMap = new Map<
    string,
    { clientName: string; requests: typeof serviceRequests }
  >();
  for (const req of serviceRequests) {
    const existing = clientMap.get(req.clientName);
    if (existing) {
      existing.requests.push(req);
    } else {
      clientMap.set(req.clientName, {
        clientName: req.clientName,
        requests: [req],
      });
    }
  }
  const uniqueClients = Array.from(clientMap.values());

  const navItems = [
    {
      id: "overview" as SideTab,
      label: "Overview",
      icon: LayoutDashboard,
      ocid: "staff_dashboard.overview.tab",
    },
    {
      id: "requests" as SideTab,
      label: "Service Requests",
      icon: ClipboardList,
      ocid: "staff_dashboard.requests.tab",
    },
    {
      id: "clients" as SideTab,
      label: "My Clients",
      icon: Users,
      ocid: "staff_dashboard.clients.tab",
    },
    {
      id: "bookings" as SideTab,
      label: "Upcoming Bookings",
      icon: CalendarDays,
      ocid: "staff_dashboard.bookings.tab",
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
                  Staff Portal
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
              <item.icon className="w-4 h-4 shrink-0" />
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
            data-ocid="staff_dashboard.change_password.open_modal_button"
            onClick={() => setChangePasswordOpen(true)}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent mb-1"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Change Password
          </Button>
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
            Staff Panel
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
                      {srLoading ? "—" : pendingCount}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pending
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4 text-center">
                    <p className="font-display text-3xl font-bold text-blue-600">
                      {srLoading ? "—" : inProgressCount}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      In Progress
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4 text-center">
                    <p className="font-display text-3xl font-bold text-green-600">
                      {srLoading ? "—" : completedCount}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* ── Task Completion Progress Bar ── */}
              <Card data-ocid="staff_dashboard.overview.progress_bar">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Task Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  {srLoading ? (
                    <Skeleton className="h-4 w-full" />
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {completedCount} of {total} completed ({completionPct}
                          %)
                        </span>
                        <span
                          className={`font-semibold text-xs px-2 py-0.5 rounded-full ${
                            completionPct >= 75
                              ? "bg-green-100 text-green-700"
                              : completionPct >= 50
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {completionPct >= 75
                            ? "On Track"
                            : completionPct >= 50
                              ? "In Progress"
                              : "Needs Attention"}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
                          style={{ width: `${completionPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                        No service requests assigned yet.
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
                  Manage and update assigned request statuses
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {REQUEST_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    data-ocid={f.ocid}
                    onClick={() => setRequestFilter(f.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      requestFilter === f.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {f.label}
                    {f.value === "all" && total > 0 && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({total})
                      </span>
                    )}
                    {f.value === "pending" && pendingCount > 0 && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({pendingCount})
                      </span>
                    )}
                    {f.value === "inProgress" && inProgressCount > 0 && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({inProgressCount})
                      </span>
                    )}
                    {f.value === "completed" && completedCount > 0 && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({completedCount})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <Card>
                <CardContent className="p-0">
                  {srLoading ? (
                    <div className="p-6 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))}
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <div
                      data-ocid="staff_dashboard.requests.empty_state"
                      className="py-16 text-center"
                    >
                      <ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        {serviceRequests.length === 0
                          ? "No service requests assigned to you yet."
                          : `No ${requestFilter === "all" ? "" : requestFilter} requests found.`}
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
                            <TableHead>Note</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Update</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRequests.map((req, index) => (
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
                              {/* Note Column */}
                              <TableCell className="max-w-[120px]">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-muted-foreground truncate">
                                    {req.staffNote
                                      ? req.staffNote.slice(0, 20) +
                                        (req.staffNote.length > 20 ? "…" : "")
                                      : "—"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 shrink-0"
                                    data-ocid={`staff_dashboard.requests.note_edit.${index + 1}`}
                                    onClick={() =>
                                      openNoteDialog(req.id, req.staffNote)
                                    }
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                </div>
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

          {/* ── My Clients ── */}
          {activeTab === "clients" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  My Clients
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Clients with requests assigned to you
                </p>
              </div>

              {srLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-36 w-full" />
                  ))}
                </div>
              ) : uniqueClients.length === 0 ? (
                <Card>
                  <CardContent
                    className="py-16 text-center"
                    data-ocid="staff_dashboard.clients.empty_state"
                  >
                    <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No clients assigned yet.
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Clients appear here when the admin assigns requests to
                      you.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uniqueClients.map((client, index) => {
                    const uniqueServices = [
                      ...new Set(client.requests.map((r) => r.serviceType)),
                    ];
                    const waText = encodeURIComponent(
                      `Hi, I'm following up on behalf of client ${client.clientName}`,
                    );
                    return (
                      <Card
                        key={client.clientName}
                        data-ocid={`staff_dashboard.clients.item.${index + 1}`}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                              {client.clientName}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {client.requests.length} request
                              {client.requests.length !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1.5">
                                Services
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {uniqueServices.map((svc) => (
                                  <span
                                    key={svc}
                                    className="inline-block text-xs bg-accent text-accent-foreground rounded-md px-2 py-0.5"
                                  >
                                    {svc}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {[
                                ServiceRequestStatus.pending,
                                ServiceRequestStatus.inProgress,
                                ServiceRequestStatus.completed,
                              ].map((status) => {
                                const count = client.requests.filter(
                                  (r) => r.status === status,
                                ).length;
                                if (count === 0) return null;
                                return (
                                  <div
                                    key={status}
                                    className="flex items-center gap-1"
                                  >
                                    <StatusBadge status={status} />
                                    <span className="text-xs text-muted-foreground">
                                      {count}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {/* WhatsApp Button */}
                            <a
                              href={`https://wa.me/919901563799?text=${waText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-ocid={`staff_dashboard.clients.whatsapp_button.${index + 1}`}
                            >
                              <Button
                                size="sm"
                                className="w-full bg-green-600 hover:bg-green-700 text-white mt-1"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp
                              </Button>
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Upcoming Bookings ── */}
          {activeTab === "bookings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Upcoming Bookings
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Pending and confirmed appointments
                </p>
              </div>

              {bookingsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-44 w-full" />
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <Card>
                  <CardContent
                    className="py-16 text-center"
                    data-ocid="staff_dashboard.bookings.empty_state"
                  >
                    <CalendarDays className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm font-medium">
                      No upcoming bookings
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Pending and confirmed appointments will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingBookings.map((booking, index) => (
                    <Card
                      key={booking.id.toString()}
                      data-ocid={`staff_dashboard.bookings.card.${index + 1}`}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <CardTitle className="text-base font-semibold truncate">
                              {booking.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5 truncate">
                              {booking.service}
                            </p>
                          </div>
                          <BookingStatusBadge status={booking.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2.5 pt-0">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground">
                            {booking.preferredDate}
                            {booking.preferredTime
                              ? ` at ${booking.preferredTime}`
                              : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground">
                            {booking.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground truncate">
                            {booking.email}
                          </span>
                        </div>
                        {booking.message && (
                          <p className="text-xs text-muted-foreground bg-muted/50 rounded-md px-2.5 py-1.5 line-clamp-2">
                            {booking.message}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />

      {/* Staff Note Dialog */}
      {noteRequestId !== null && (
        <StaffNoteDialog
          open={noteDialogOpen}
          onOpenChange={setNoteDialogOpen}
          requestId={noteRequestId}
          currentNote={noteCurrentValue}
        />
      )}
    </div>
  );
}
