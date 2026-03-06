import {
  type BlogPost,
  LeadStatus,
  Role,
  ServiceRequestStatus,
} from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
  useAssignStaffToRequest,
  useChangePassword,
  useCreateBlogPost,
  useCreateUser,
  useDeleteBlogPost,
  useGetLeads,
  useGetRevenueStats,
  useListAllBlogPosts,
  useListAllServiceRequests,
  useListUsers,
  useToggleUserActive,
  useUpdateBlogPost,
  useUpdateLeadStatus,
  useUpdateServiceRequestStatus,
} from "@/hooks/useQueries";
import { clearSession, getSession, hashPassword } from "@/utils/auth";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  ClipboardList,
  Globe,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCircle2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

type Tab =
  | "overview"
  | "leads"
  | "users"
  | "blog"
  | "service-requests"
  | "analytics";

function LeadStatusBadge({ status }: { status: LeadStatus }) {
  if (status === LeadStatus.new_) {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
        New
      </Badge>
    );
  }
  if (status === LeadStatus.inProgress) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
        In Progress
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
      Resolved
    </Badge>
  );
}

function ServiceRequestStatusBadge({
  status,
}: { status: ServiceRequestStatus }) {
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

const emptyBlogForm = {
  title: "",
  excerpt: "",
  content: "",
  authorName: "",
  isPublished: false,
};

const CHART_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#6366f1", "#10b981"];

// ─── Change Password Dialog ────────────────────────────────────────────────────

function ChangePasswordDialog({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const { mutateAsync: changePassword, isPending } = useChangePassword();

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
      <DialogContent data-ocid="admin_dashboard.change_password.dialog">
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
              data-ocid="admin_dashboard.change_password.current_input"
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
              data-ocid="admin_dashboard.change_password.new_input"
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
              data-ocid="admin_dashboard.change_password.confirm_input"
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
              data-ocid="admin_dashboard.change_password.cancel_button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="admin_dashboard.change_password.save_button"
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

// ─── Staff Note Dialog ─────────────────────────────────────────────────────────

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
      <DialogContent data-ocid="service_requests.note.dialog">
        <DialogHeader>
          <DialogTitle>Staff Note</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Textarea
            data-ocid="service_requests.note.textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a staff note for this request..."
            rows={4}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            data-ocid="service_requests.note.cancel_button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            data-ocid="service_requests.note.save_button"
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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [createOpen, setCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: Role.client as Role,
  });

  // Blog state
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletePostId, setDeletePostId] = useState<bigint | null>(null);
  const [deletePostOpen, setDeletePostOpen] = useState(false);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);

  // Change password
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Note dialog
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteRequestId, setNoteRequestId] = useState<bigint | null>(null);
  const [noteCurrentValue, setNoteCurrentValue] = useState("");

  const navigate = useNavigate();
  const session = getSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time check
  useEffect(() => {
    if (!session || session.role !== "admin") {
      navigate({ to: "/admin-login" });
    }
  }, [navigate]);

  const { data: leads = [], isLoading: leadsLoading } = useGetLeads();
  const { data: users = [], isLoading: usersLoading } = useListUsers();
  const { data: blogPosts = [], isLoading: blogLoading } =
    useListAllBlogPosts();
  const { data: serviceRequests = [], isLoading: srLoading } =
    useListAllServiceRequests();
  const { data: revenueStats, isLoading: statsLoading } = useGetRevenueStats();

  const { mutate: updateStatus } = useUpdateLeadStatus();
  const { mutate: toggleActive } = useToggleUserActive();
  const { mutateAsync: createUser, isPending: creatingUser } = useCreateUser();
  const { mutateAsync: createBlogPost, isPending: creatingBlog } =
    useCreateBlogPost();
  const { mutateAsync: updateBlogPost, isPending: updatingBlog } =
    useUpdateBlogPost();
  const { mutateAsync: deleteBlogPost, isPending: deletingBlog } =
    useDeleteBlogPost();
  const { mutate: updateSRStatus } = useUpdateServiceRequestStatus();
  const { mutateAsync: assignStaff } = useAssignStaffToRequest();

  const staffUsers = users.filter((u) => u.role === Role.staff);

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/" });
    toast.success("Logged out successfully");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const hash = await hashPassword(newUser.password);
      await createUser({
        username: newUser.username,
        passwordHash: hash,
        role: newUser.role,
      });
      toast.success("User created successfully");
      setCreateOpen(false);
      setNewUser({ username: "", password: "", role: Role.client });
    } catch {
      toast.error("Failed to create user");
    }
  };

  const openAddBlogModal = () => {
    setEditingPost(null);
    setBlogForm(emptyBlogForm);
    setBlogModalOpen(true);
  };

  const openEditBlogModal = (post: BlogPost) => {
    setEditingPost(post);
    setBlogForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      authorName: post.authorName,
      isPublished: post.isPublished,
    });
    setBlogModalOpen(true);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content || !blogForm.authorName) {
      toast.error("Please fill title, content, and author name");
      return;
    }
    try {
      if (editingPost) {
        await updateBlogPost({
          id: editingPost.id,
          title: blogForm.title,
          content: blogForm.content,
          excerpt: blogForm.excerpt,
          isPublished: blogForm.isPublished,
        });
        toast.success("Post updated");
      } else {
        await createBlogPost({
          title: blogForm.title,
          content: blogForm.content,
          excerpt: blogForm.excerpt,
          authorName: blogForm.authorName,
        });
        toast.success("Post created");
      }
      setBlogModalOpen(false);
      setBlogForm(emptyBlogForm);
      setEditingPost(null);
    } catch {
      toast.error("Failed to save post");
    }
  };

  const confirmDeletePost = (id: bigint) => {
    setDeletePostId(id);
    setDeletePostOpen(true);
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    try {
      await deleteBlogPost(deletePostId);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletePostOpen(false);
      setDeletePostId(null);
    }
  };

  const handleAssignStaff = async (requestId: bigint, staffUserId: bigint) => {
    try {
      await assignStaff({ requestId, staffUserId });
      toast.success("Staff assigned");
    } catch {
      toast.error("Failed to assign staff");
    }
  };

  const openNoteDialog = (requestId: bigint, currentNote: string) => {
    setNoteRequestId(requestId);
    setNoteCurrentValue(currentNote);
    setNoteDialogOpen(true);
  };

  const activeUsers = users.filter((u) => u.isActive).length;
  const pendingSR = serviceRequests.filter(
    (r) => r.status === ServiceRequestStatus.pending,
  ).length;
  const inProgressSR = serviceRequests.filter(
    (r) => r.status === ServiceRequestStatus.inProgress,
  ).length;
  const completedSR = serviceRequests.filter(
    (r) => r.status === ServiceRequestStatus.completed,
  ).length;

  // Chart data from revenueStats
  const chartData = revenueStats
    ? [
        { name: "New Leads", value: Number(revenueStats.newLeads) },
        { name: "Resolved Leads", value: Number(revenueStats.resolvedLeads) },
        {
          name: "Pending Requests",
          value: Number(revenueStats.pendingRequests),
        },
        { name: "In Progress", value: Number(revenueStats.inProgressRequests) },
        { name: "Completed", value: Number(revenueStats.completedRequests) },
      ]
    : [];

  const navItems = [
    {
      id: "overview" as Tab,
      label: "Overview",
      icon: LayoutDashboard,
      ocid: "admin_dashboard.overview.tab",
    },
    {
      id: "analytics" as Tab,
      label: "Analytics",
      icon: BarChart2,
      ocid: "admin_dashboard.analytics.tab",
    },
    {
      id: "leads" as Tab,
      label: "Leads",
      icon: MessageSquare,
      ocid: "admin_dashboard.leads.tab",
    },
    {
      id: "service-requests" as Tab,
      label: "Service Requests",
      icon: ClipboardList,
      ocid: "admin_dashboard.service_requests.tab",
    },
    {
      id: "blog" as Tab,
      label: "Blog",
      icon: BookOpen,
      ocid: "admin_dashboard.blog.tab",
    },
    {
      id: "users" as Tab,
      label: "Users",
      icon: Users,
      ocid: "admin_dashboard.users.tab",
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
              <p className="text-xs text-sidebar-foreground/50">Admin Panel</p>
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
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-teal" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                Administrator
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                ID: {session?.userId?.slice(0, 12)}...
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="admin_dashboard.change_password.open_modal_button"
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
      <main className="flex-1 p-6 overflow-auto">
        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Overview
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Welcome back, Administrator
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Leads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="font-display text-3xl font-bold text-foreground">
                      {leads.length}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Service Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {srLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="font-display text-3xl font-bold text-foreground">
                      {serviceRequests.length}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="font-display text-3xl font-bold text-foreground">
                      {users.length}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="font-display text-3xl font-bold text-foreground">
                      {activeUsers}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Leads</CardTitle>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : leads.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No leads yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {leads.slice(0, 5).map((lead) => (
                      <div
                        key={lead.id.toString()}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {lead.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lead.service}
                          </p>
                        </div>
                        <LeadStatusBadge status={lead.status} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Analytics ── */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Analytics
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Business performance overview
              </p>
            </div>

            {/* Stat Cards */}
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : !revenueStats ? (
              <div
                data-ocid="analytics.error_state"
                className="py-12 text-center"
              >
                <p className="text-muted-foreground text-sm">
                  Unable to load stats.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Leads",
                      value: Number(revenueStats.totalLeads),
                      color: "text-foreground",
                    },
                    {
                      label: "New Leads",
                      value: Number(revenueStats.newLeads),
                      color: "text-blue-600",
                    },
                    {
                      label: "Resolved Leads",
                      value: Number(revenueStats.resolvedLeads),
                      color: "text-green-600",
                    },
                    {
                      label: "Total Requests",
                      value: Number(revenueStats.totalRequests),
                      color: "text-foreground",
                    },
                    {
                      label: "Pending",
                      value: Number(revenueStats.pendingRequests),
                      color: "text-yellow-600",
                    },
                    {
                      label: "In Progress",
                      value: Number(revenueStats.inProgressRequests),
                      color: "text-blue-600",
                    },
                    {
                      label: "Completed",
                      value: Number(revenueStats.completedRequests),
                      color: "text-green-600",
                    },
                  ].map((stat) => (
                    <Card key={stat.label}>
                      <CardContent className="pt-4 pb-4 text-center">
                        <p
                          className={`font-display text-3xl font-bold ${stat.color}`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.label}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Leads & Requests Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                          />
                          <XAxis
                            dataKey="name"
                            tick={{
                              fontSize: 11,
                              fill: "hsl(var(--muted-foreground))",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{
                              fontSize: 11,
                              fill: "hsl(var(--muted-foreground))",
                            }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* ── Leads ── */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Leads
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                All contact form submissions
              </p>
            </div>

            <Card>
              <CardContent className="p-0">
                {leadsLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : leads.length === 0 ? (
                  <div
                    data-ocid="leads.empty_state"
                    className="py-16 text-center"
                  >
                    <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No leads yet. They'll appear here once clients submit the
                      contact form.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="leads.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Update</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead, index) => (
                          <TableRow
                            key={lead.id.toString()}
                            data-ocid={`leads.row.${index + 1}`}
                          >
                            <TableCell className="font-medium text-sm">
                              {lead.name}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {lead.phone}
                            </TableCell>
                            <TableCell className="text-sm">
                              {lead.service}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                              {lead.message}
                            </TableCell>
                            <TableCell>
                              <LeadStatusBadge status={lead.status} />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(lead.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={lead.status}
                                onValueChange={(v) =>
                                  updateStatus({
                                    id: lead.id,
                                    status: v as LeadStatus,
                                  })
                                }
                              >
                                <SelectTrigger
                                  className="w-32 h-8 text-xs"
                                  data-ocid={`leads.status_select.${index + 1}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={LeadStatus.new_}>
                                    New
                                  </SelectItem>
                                  <SelectItem value={LeadStatus.inProgress}>
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value={LeadStatus.resolved}>
                                    Resolved
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
          </div>
        )}

        {/* ── Service Requests ── */}
        {activeTab === "service-requests" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Service Requests
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                All client service requests
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="font-display text-2xl font-bold text-yellow-600">
                    {pendingSR}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="font-display text-2xl font-bold text-blue-600">
                    {inProgressSR}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    In Progress
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="font-display text-2xl font-bold text-green-600">
                    {completedSR}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-0">
                {srLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : serviceRequests.length === 0 ? (
                  <div
                    data-ocid="service_requests.empty_state"
                    className="py-16 text-center"
                  >
                    <ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No service requests yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="service_requests.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Assigned Staff</TableHead>
                          <TableHead>Note</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Update</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceRequests.map((req, index) => {
                          const assignedStaff = req.assignedStaffId
                            ? users.find((u) => u.id === req.assignedStaffId)
                            : null;

                          return (
                            <TableRow
                              key={req.id.toString()}
                              data-ocid={`service_requests.row.${index + 1}`}
                            >
                              <TableCell className="font-medium text-sm">
                                {req.clientName}
                              </TableCell>
                              <TableCell className="text-sm">
                                {req.serviceType}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                                {req.description}
                              </TableCell>
                              {/* Assign Staff Column */}
                              <TableCell>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 text-xs max-w-[120px] truncate"
                                      data-ocid={`service_requests.assign_staff.${index + 1}`}
                                    >
                                      {assignedStaff
                                        ? assignedStaff.username
                                        : "Unassigned"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-48 p-2"
                                    data-ocid={`service_requests.assign_staff_popover.${index + 1}`}
                                  >
                                    <p className="text-xs text-muted-foreground mb-2 px-1">
                                      Assign to staff
                                    </p>
                                    {staffUsers.length === 0 ? (
                                      <p className="text-xs text-muted-foreground px-1">
                                        No staff accounts yet.
                                      </p>
                                    ) : (
                                      <div className="space-y-1">
                                        {staffUsers.map((staff) => (
                                          <button
                                            key={staff.id.toString()}
                                            type="button"
                                            onClick={() =>
                                              handleAssignStaff(
                                                req.id,
                                                staff.id,
                                              )
                                            }
                                            className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-accent transition-colors ${
                                              req.assignedStaffId === staff.id
                                                ? "bg-accent font-medium"
                                                : ""
                                            }`}
                                          >
                                            {staff.username}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </PopoverContent>
                                </Popover>
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
                                    data-ocid={`service_requests.note_edit.${index + 1}`}
                                    onClick={() =>
                                      openNoteDialog(req.id, req.staffNote)
                                    }
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <ServiceRequestStatusBadge
                                  status={req.status}
                                />
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(req.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={req.status}
                                  onValueChange={(v) =>
                                    updateSRStatus({
                                      id: req.id,
                                      status: v as ServiceRequestStatus,
                                    })
                                  }
                                >
                                  <SelectTrigger
                                    className="w-36 h-8 text-xs"
                                    data-ocid={`service_requests.status_select.${index + 1}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      value={ServiceRequestStatus.pending}
                                    >
                                      Pending
                                    </SelectItem>
                                    <SelectItem
                                      value={ServiceRequestStatus.inProgress}
                                    >
                                      In Progress
                                    </SelectItem>
                                    <SelectItem
                                      value={ServiceRequestStatus.completed}
                                    >
                                      Completed
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Blog ── */}
        {activeTab === "blog" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Blog Posts
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage all blog content
                </p>
              </div>
              <Button
                size="sm"
                onClick={openAddBlogModal}
                data-ocid="blog.add_post_button"
                className="font-medium"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Post
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                {blogLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : blogPosts.length === 0 ? (
                  <div
                    data-ocid="blog.empty_state"
                    className="py-16 text-center"
                  >
                    <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No blog posts yet. Create your first post!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="blog.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Published</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts.map((post, index) => (
                          <TableRow
                            key={post.id.toString()}
                            data-ocid={`blog.row.${index + 1}`}
                          >
                            <TableCell className="font-medium text-sm max-w-[240px] truncate">
                              {post.title}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {post.authorName}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  post.isPublished
                                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100"
                                }
                              >
                                {post.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(post.createdAt)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-ocid={`blog.edit_button.${index + 1}`}
                                  onClick={() => openEditBlogModal(post)}
                                  className="h-7 px-2"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-ocid={`blog.delete_button.${index + 1}`}
                                  onClick={() => confirmDeletePost(post.id)}
                                  className="h-7 px-2 text-destructive border-destructive/20 hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Users ── */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Users
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage staff and client accounts
                </p>
              </div>

              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    data-ocid="users.create_user_button"
                    className="font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent data-ocid="users.create_user.dialog">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">
                        Username
                      </Label>
                      <Input
                        placeholder="username"
                        data-ocid="users.create_user.input"
                        value={newUser.username}
                        onChange={(e) =>
                          setNewUser((p) => ({
                            ...p,
                            username: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">
                        Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser((p) => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">
                        Role
                      </Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(v) =>
                          setNewUser((p) => ({ ...p, role: v as Role }))
                        }
                      >
                        <SelectTrigger data-ocid="users.create_user.select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Role.admin}>Admin</SelectItem>
                          <SelectItem value={Role.staff}>Staff</SelectItem>
                          <SelectItem value={Role.client}>Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        data-ocid="users.create_user.cancel_button"
                        onClick={() => setCreateOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        data-ocid="users.create_user.confirm_button"
                        disabled={creatingUser}
                      >
                        {creatingUser ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create User"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                {usersLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : users.length === 0 ? (
                  <div
                    data-ocid="users.empty_state"
                    className="py-16 text-center"
                  >
                    <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No users created yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="users.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user, index) => (
                          <TableRow
                            key={user.id.toString()}
                            data-ocid={`users.row.${index + 1}`}
                          >
                            <TableCell className="font-medium text-sm">
                              <div className="flex items-center gap-2">
                                {user.role === Role.admin ? (
                                  <ShieldCheck className="w-4 h-4 text-primary" />
                                ) : user.role === Role.staff ? (
                                  <UserCheck className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <UserCircle2 className="w-4 h-4 text-muted-foreground" />
                                )}
                                {user.username}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="capitalize text-sm text-muted-foreground">
                                {user.role}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  user.isActive
                                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100"
                                }
                              >
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                data-ocid={`users.toggle_button.${index + 1}`}
                                onClick={() => toggleActive(user.id)}
                                className="text-xs h-7"
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Blog Add/Edit Modal */}
      <Dialog open={blogModalOpen} onOpenChange={setBlogModalOpen}>
        <DialogContent className="max-w-2xl" data-ocid="blog.post_form.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBlogSubmit} className="space-y-4 pt-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Title *
              </Label>
              <Input
                data-ocid="blog.post_form.title_input"
                placeholder="Post title..."
                value={blogForm.title}
                onChange={(e) =>
                  setBlogForm((p) => ({ ...p, title: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Excerpt (short description)
              </Label>
              <Input
                data-ocid="blog.post_form.excerpt_input"
                placeholder="Brief description shown in listing..."
                value={blogForm.excerpt}
                onChange={(e) =>
                  setBlogForm((p) => ({ ...p, excerpt: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Author Name *
              </Label>
              <Input
                data-ocid="blog.post_form.author_input"
                placeholder="Mounith H C"
                value={blogForm.authorName}
                onChange={(e) =>
                  setBlogForm((p) => ({ ...p, authorName: e.target.value }))
                }
                required
                disabled={!!editingPost}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Content *
              </Label>
              <Textarea
                data-ocid="blog.post_form.content_textarea"
                placeholder="Write your blog post content here..."
                rows={8}
                value={blogForm.content}
                onChange={(e) =>
                  setBlogForm((p) => ({ ...p, content: e.target.value }))
                }
                required
                className="resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="blog.post_form.published_switch"
                checked={blogForm.isPublished}
                onCheckedChange={(v) =>
                  setBlogForm((p) => ({ ...p, isPublished: v }))
                }
              />
              <Label className="text-sm font-medium cursor-pointer">
                {blogForm.isPublished
                  ? "Published"
                  : "Draft — not visible to public"}
              </Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="blog.post_form.cancel_button"
                onClick={() => setBlogModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="blog.post_form.save_button"
                disabled={creatingBlog || updatingBlog}
              >
                {creatingBlog || updatingBlog ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingPost ? (
                  "Update Post"
                ) : (
                  "Create Post"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deletePostOpen} onOpenChange={setDeletePostOpen}>
        <DialogContent data-ocid="blog.delete_post.dialog">
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="blog.delete_post.cancel_button"
              onClick={() => setDeletePostOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="blog.delete_post.confirm_button"
              disabled={deletingBlog}
              onClick={handleDeletePost}
            >
              {deletingBlog ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
