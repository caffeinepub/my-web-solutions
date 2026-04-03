import {
  type BlogPost,
  BookingStatus,
  InvoiceStatus,
  LeadStatus,
  Role,
  ServiceRequestStatus,
} from "@/backend.d";
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
  useCreateInvoice,
  useCreateUser,
  useDeleteBlogPost,
  useDeleteBooking,
  useGetLeads,
  useGetRevenueStats,
  useListAllBlogPosts,
  useListAllInvoices,
  useListAllServiceRequests,
  useListBookings,
  useListUsers,
  useToggleUserActive,
  useUpdateBlogPost,
  useUpdateBookingStatus,
  useUpdateInvoiceStatus,
  useUpdateLeadStatus,
  useUpdateServiceRequestStatus,
} from "@/hooks/useQueries";
import { clearSession, getSession, hashPassword } from "@/utils/auth";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Globe,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
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
  Legend,
  Pie,
  PieChart,
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
  | "analytics"
  | "bookings"
  | "newsletter"
  | "invoices";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const { data: bookings = [], isLoading: bookingsLoading } = useListBookings();
  const { data: invoices = [], isLoading: invoicesLoading } =
    useListAllInvoices();

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
  const { mutate: updateBookingStatusMutate } = useUpdateBookingStatus();
  const { mutateAsync: deleteBookingMutate, isPending: deletingBooking } =
    useDeleteBooking();
  const { mutate: updateInvoiceStatusMutate } = useUpdateInvoiceStatus();
  const { mutateAsync: createInvoice, isPending: creatingInvoice } =
    useCreateInvoice();

  // Booking delete dialog state
  const [deleteBookingId, setDeleteBookingId] = useState<bigint | null>(null);
  const [deleteBookingOpen, setDeleteBookingOpen] = useState(false);

  // Feature 2: Full message view dialog
  const [viewMessageOpen, setViewMessageOpen] = useState(false);
  const [viewMessageText, setViewMessageText] = useState("");

  // Feature 3: Deactivate user AlertDialog
  const [deactivateUserId, setDeactivateUserId] = useState<bigint | null>(null);
  const [deactivateUserOpen, setDeactivateUserOpen] = useState(false);

  // Feature 4: Bookings filter state
  const [bookingStatusFilter, setBookingStatusFilter] = useState<
    "all" | BookingStatus
  >("all");
  const [bookingDateSearch, setBookingDateSearch] = useState("");

  // Invoice state
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    clientUserId: "",
    serviceType: "",
    amount: "",
    currency: "INR",
    dueDate: "",
    notes: "",
  });

  const confirmDeleteBooking = (id: bigint) => {
    setDeleteBookingId(id);
    setDeleteBookingOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!deleteBookingId) return;
    try {
      await deleteBookingMutate(deleteBookingId);
      toast.success("Booking deleted");
    } catch {
      toast.error("Failed to delete booking");
    } finally {
      setDeleteBookingOpen(false);
      setDeleteBookingId(null);
    }
  };

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

  // Feature 1: CSV Export
  const handleExportLeads = () => {
    if (leads.length === 0) {
      toast.error("No leads to export");
      return;
    }
    const header = ["Name", "Phone", "Service", "Message", "Status", "Date"];
    const rows = leads.map((lead) => [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.phone.replace(/"/g, '""')}"`,
      `"${lead.service.replace(/"/g, '""')}"`,
      `"${lead.message.replace(/"/g, '""')}"`,
      `"${lead.status}"`,
      `"${formatDate(lead.createdAt)}"`,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Leads exported successfully");
  };

  // Feature 3: Deactivate user handler
  const confirmDeactivateUser = (id: bigint) => {
    setDeactivateUserId(id);
    setDeactivateUserOpen(true);
  };

  const handleDeactivateUser = () => {
    if (!deactivateUserId) return;
    toggleActive(deactivateUserId);
    toast.success("User deactivated");
    setDeactivateUserOpen(false);
    setDeactivateUserId(null);
  };

  // Invoice create handler
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !invoiceForm.clientUserId ||
      !invoiceForm.serviceType ||
      !invoiceForm.amount ||
      !invoiceForm.dueDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await createInvoice({
        clientUserId: BigInt(invoiceForm.clientUserId),
        serviceType: invoiceForm.serviceType,
        amount: BigInt(invoiceForm.amount),
        currency: invoiceForm.currency,
        dueDate: invoiceForm.dueDate,
        notes: invoiceForm.notes,
      });
      toast.success("Invoice created successfully");
      setCreateInvoiceOpen(false);
      setInvoiceForm({
        clientUserId: "",
        serviceType: "",
        amount: "",
        currency: "INR",
        dueDate: "",
        notes: "",
      });
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  // Feature 4: Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const statusMatch =
      bookingStatusFilter === "all" || b.status === bookingStatusFilter;
    const dateMatch =
      !bookingDateSearch || b.preferredDate.includes(bookingDateSearch);
    return statusMatch && dateMatch;
  });

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
      id: "bookings" as Tab,
      label: "Bookings",
      icon: CalendarCheck,
      ocid: "admin_dashboard.bookings.tab",
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
    {
      id: "newsletter" as Tab,
      label: "Newsletter",
      icon: Mail,
      ocid: "admin_dashboard.newsletter.tab",
    },
    {
      id: "invoices" as Tab,
      label: "Invoices",
      icon: FileText,
      ocid: "admin_dashboard.invoices.tab",
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
                  Admin Panel
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
            Admin Panel
          </span>
        </div>
        <div className="p-4 md:p-6">
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
                                  fill={
                                    CHART_COLORS[index % CHART_COLORS.length]
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ── Insight Summary Bar ── */}
                  {statsLoading ? (
                    <div className="flex gap-3">
                      <Skeleton className="h-9 w-44 rounded-full" />
                      <Skeleton className="h-9 w-48 rounded-full" />
                    </div>
                  ) : (
                    revenueStats && (
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                          {Number(revenueStats.totalLeads) > 0
                            ? Math.round(
                                (Number(revenueStats.resolvedLeads) /
                                  Number(revenueStats.totalLeads)) *
                                  100,
                              )
                            : 0}
                          % Leads Resolved
                        </span>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {Number(revenueStats.totalRequests) > 0
                            ? Math.round(
                                (Number(revenueStats.completedRequests) /
                                  Number(revenueStats.totalRequests)) *
                                  100,
                              )
                            : 0}
                          % Requests Completed
                        </span>
                      </div>
                    )
                  )}

                  {/* ── Service Requests by Status (Pie/Donut) ── */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Service Requests by Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Pending", value: pendingSR },
                                { name: "In Progress", value: inProgressSR },
                                { name: "Completed", value: completedSR },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              <Cell fill="#f59e0b" />
                              <Cell fill="#3b82f6" />
                              <Cell fill="#22c55e" />
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                fontSize: "12px",
                              }}
                            />
                            <Legend
                              iconType="circle"
                              iconSize={8}
                              formatter={(value) => (
                                <span className="text-xs text-muted-foreground">
                                  {value}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ── Bookings by Status (Horizontal Bar) ── */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Bookings by Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={[
                              {
                                name: "Pending",
                                count: bookings.filter(
                                  (b) => b.status === BookingStatus.pending,
                                ).length,
                                fill: "#f59e0b",
                              },
                              {
                                name: "Confirmed",
                                count: bookings.filter(
                                  (b) => b.status === BookingStatus.confirmed,
                                ).length,
                                fill: "#3b82f6",
                              },
                              {
                                name: "Completed",
                                count: bookings.filter(
                                  (b) => b.status === BookingStatus.completed,
                                ).length,
                                fill: "#22c55e",
                              },
                              {
                                name: "Rejected",
                                count: bookings.filter(
                                  (b) => b.status === BookingStatus.rejected,
                                ).length,
                                fill: "#ef4444",
                              },
                            ]}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="hsl(var(--border))"
                              horizontal={false}
                            />
                            <XAxis type="number" tick={{ fontSize: 11 }} />
                            <YAxis
                              dataKey="name"
                              type="category"
                              tick={{ fontSize: 11 }}
                              width={70}
                            />
                            <Tooltip
                              contentStyle={{
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                fontSize: "12px",
                              }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                              <Cell fill="#f59e0b" />
                              <Cell fill="#3b82f6" />
                              <Cell fill="#22c55e" />
                              <Cell fill="#ef4444" />
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Leads
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    All contact form submissions
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="leads.export_button"
                  onClick={handleExportLeads}
                  disabled={leadsLoading || leads.length === 0}
                  className="font-medium"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Export CSV
                </Button>
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
                        No leads yet. They'll appear here once clients submit
                        the contact form.
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
                              <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                                <div className="flex items-center gap-1">
                                  <span className="truncate block max-w-[160px]">
                                    {lead.message}
                                  </span>
                                  {lead.message && lead.message.length > 40 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 shrink-0"
                                      data-ocid={`leads.view_message_button.${index + 1}`}
                                      onClick={() => {
                                        setViewMessageText(lead.message);
                                        setViewMessageOpen(true);
                                      }}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <LeadStatusBadge status={lead.status} />
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(lead.createdAt)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 items-center">
                                  <a
                                    href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${lead.name}, thank you for reaching out about ${lead.service}. We've received your inquiry and our team will get back to you shortly. - My Web Solutions`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-ocid={`leads.whatsapp_button.${index + 1}`}
                                    className="inline-flex items-center gap-1 h-8 px-2 text-xs rounded-md bg-[#25D366] text-white font-medium hover:bg-[#1ebe5d] transition-colors"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    WhatsApp
                                  </a>
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

          {/* ── Bookings ── */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Bookings
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  All appointment booking requests
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total",
                    count: bookings.length,
                    color: "text-foreground",
                  },
                  {
                    label: "Pending",
                    count: bookings.filter(
                      (b) => b.status === BookingStatus.pending,
                    ).length,
                    color: "text-yellow-600",
                  },
                  {
                    label: "Confirmed",
                    count: bookings.filter(
                      (b) => b.status === BookingStatus.confirmed,
                    ).length,
                    color: "text-green-600",
                  },
                  {
                    label: "Completed",
                    count: bookings.filter(
                      (b) => b.status === BookingStatus.completed,
                    ).length,
                    color: "text-blue-600",
                  },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="pt-4 pb-4 text-center">
                      <p
                        className={`font-display text-3xl font-bold ${stat.color}`}
                      >
                        {stat.count}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Feature 4: Bookings filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      "all",
                      BookingStatus.pending,
                      BookingStatus.confirmed,
                      BookingStatus.completed,
                      BookingStatus.rejected,
                    ] as const
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      data-ocid={`bookings.filter_${status}.tab`}
                      onClick={() => setBookingStatusFilter(status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        bookingStatusFilter === status
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:bg-accent"
                      }`}
                    >
                      {status === "all"
                        ? "All"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search by date e.g. 2026-03-15"
                    value={bookingDateSearch}
                    onChange={(e) => setBookingDateSearch(e.target.value)}
                    data-ocid="bookings.date_search_input"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  {bookingsLoading ? (
                    <div className="p-6 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div
                      data-ocid="bookings.empty_state"
                      className="py-16 text-center"
                    >
                      <CalendarCheck className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        {bookings.length === 0
                          ? "No bookings yet. They'll appear here once clients submit an appointment request."
                          : "No bookings match the current filters."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table data-ocid="bookings.table">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBookings.map((booking, index) => {
                            const waNotifyUrl = `https://wa.me/91${booking.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${booking.name}, your appointment for ${booking.service} on ${booking.preferredDate} has been confirmed! - My Web Solutions`)}`;

                            return (
                              <TableRow
                                key={booking.id.toString()}
                                data-ocid={`bookings.row.${index + 1}`}
                              >
                                <TableCell className="font-medium text-sm whitespace-nowrap">
                                  {booking.name}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                  {booking.phone}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                                  {booking.email}
                                </TableCell>
                                <TableCell className="text-sm max-w-[160px] truncate">
                                  {booking.service}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                  {booking.preferredDate}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                  {booking.preferredTime}
                                </TableCell>
                                <TableCell>
                                  {booking.status === BookingStatus.pending && (
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 whitespace-nowrap">
                                      Pending
                                    </Badge>
                                  )}
                                  {booking.status ===
                                    BookingStatus.confirmed && (
                                    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 whitespace-nowrap">
                                      Confirmed
                                    </Badge>
                                  )}
                                  {booking.status ===
                                    BookingStatus.completed && (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 whitespace-nowrap">
                                      Completed
                                    </Badge>
                                  )}
                                  {booking.status ===
                                    BookingStatus.rejected && (
                                    <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 whitespace-nowrap">
                                      Rejected
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1.5 flex-wrap min-w-[200px]">
                                    {/* Confirm */}
                                    {booking.status !==
                                      BookingStatus.confirmed && (
                                      <Button
                                        size="sm"
                                        className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                                        data-ocid={`bookings.confirm_button.${index + 1}`}
                                        onClick={() =>
                                          updateBookingStatusMutate({
                                            id: booking.id,
                                            status: BookingStatus.confirmed,
                                          })
                                        }
                                      >
                                        Confirm
                                      </Button>
                                    )}
                                    {/* WhatsApp Notify (shown when confirmed) */}
                                    {booking.status ===
                                      BookingStatus.confirmed && (
                                      <a
                                        href={waNotifyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-ocid={`bookings.whatsapp_notify_button.${index + 1}`}
                                        className="inline-flex items-center gap-1 h-7 px-2 text-xs rounded-md bg-[#25D366] text-white font-medium hover:bg-[#1ebe5d] transition-colors"
                                      >
                                        <MessageCircle className="w-3 h-3" />
                                        Notify
                                      </a>
                                    )}
                                    {/* Reject */}
                                    {booking.status !==
                                      BookingStatus.rejected && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                        data-ocid={`bookings.reject_button.${index + 1}`}
                                        onClick={() =>
                                          updateBookingStatusMutate({
                                            id: booking.id,
                                            status: BookingStatus.rejected,
                                          })
                                        }
                                      >
                                        Reject
                                      </Button>
                                    )}
                                    {/* Complete */}
                                    {booking.status !==
                                      BookingStatus.completed && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 px-2 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                                        data-ocid={`bookings.complete_button.${index + 1}`}
                                        onClick={() =>
                                          updateBookingStatusMutate({
                                            id: booking.id,
                                            status: BookingStatus.completed,
                                          })
                                        }
                                      >
                                        Complete
                                      </Button>
                                    )}
                                    {/* Delete */}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 px-2 text-xs text-destructive border-destructive/20 hover:bg-destructive/10"
                                      data-ocid={`bookings.delete_button.${index + 1}`}
                                      onClick={() =>
                                        confirmDeleteBooking(booking.id)
                                      }
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Pending
                    </p>
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
                    <form
                      onSubmit={handleCreateUser}
                      className="space-y-4 pt-2"
                    >
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
                            <TableHead>Actions</TableHead>
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
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    data-ocid={`users.toggle_button.${index + 1}`}
                                    onClick={() => toggleActive(user.id)}
                                    className="text-xs h-7"
                                  >
                                    {user.isActive ? "Deactivate" : "Activate"}
                                  </Button>
                                  {user.role !== Role.admin && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      data-ocid={`users.delete_button.${index + 1}`}
                                      onClick={() =>
                                        confirmDeactivateUser(user.id)
                                      }
                                      className="h-7 w-7 p-0 text-destructive border-destructive/20 hover:bg-destructive/10"
                                      title="Deactivate user"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
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

          {/* ── Newsletter ── */}
          {activeTab === "newsletter" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Newsletter Subscribers
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Email addresses collected from the website newsletter signup
                  form.
                </p>
              </div>

              <Card data-ocid="newsletter.card">
                <CardContent className="py-16 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Mail className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      No subscribers yet
                    </p>
                    <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                      Email addresses collected from the website newsletter
                      signup form will appear here in a future update.
                    </p>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 mt-1">
                    Coming Soon
                  </Badge>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── Invoices ── */}
          {activeTab === "invoices" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Invoices
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Manage client invoices and billing
                  </p>
                </div>
                <Button
                  size="sm"
                  data-ocid="invoices.create_invoice_button"
                  onClick={() => setCreateInvoiceOpen(true)}
                  className="font-medium"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Invoice
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <p className="font-display text-3xl font-bold text-foreground">
                      {invoices.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <p className="font-display text-3xl font-bold text-green-600">
                      {
                        invoices.filter((i) => i.status === InvoiceStatus.paid)
                          .length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Paid</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <p className="font-display text-3xl font-bold text-orange-600">
                      {
                        invoices.filter(
                          (i) => i.status === InvoiceStatus.unpaid,
                        ).length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Unpaid</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-0">
                  {invoicesLoading ? (
                    <div className="p-6 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : invoices.length === 0 ? (
                    <div
                      data-ocid="invoices.empty_state"
                      className="py-16 text-center"
                    >
                      <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        No invoices yet. Create your first invoice above.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table data-ocid="invoices.table">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Client ID</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((invoice, index) => {
                            const isPaid =
                              invoice.status === InvoiceStatus.paid;
                            return (
                              <TableRow
                                key={invoice.id.toString()}
                                data-ocid={`invoices.row.${index + 1}`}
                              >
                                <TableCell className="text-sm text-muted-foreground font-mono">
                                  {invoice.clientUserId.toString()}
                                </TableCell>
                                <TableCell className="text-sm font-medium max-w-[180px] truncate">
                                  {invoice.serviceType}
                                </TableCell>
                                <TableCell className="text-sm font-semibold">
                                  {invoice.currency === "INR"
                                    ? `₹${Number(invoice.amount).toLocaleString("en-IN")}`
                                    : `${invoice.currency} ${Number(invoice.amount).toLocaleString()}`}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {invoice.currency}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                  {invoice.dueDate}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      isPaid
                                        ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                        : "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100"
                                    }
                                  >
                                    {isPaid ? "Paid" : "Unpaid"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    data-ocid={`invoices.toggle_status_button.${index + 1}`}
                                    className={`h-7 text-xs ${isPaid ? "text-orange-600 border-orange-200 hover:bg-orange-50" : "text-green-600 border-green-200 hover:bg-green-50"}`}
                                    onClick={() =>
                                      updateInvoiceStatusMutate({
                                        id: invoice.id,
                                        status: isPaid
                                          ? InvoiceStatus.unpaid
                                          : InvoiceStatus.paid,
                                      })
                                    }
                                  >
                                    Mark {isPaid ? "Unpaid" : "Paid"}
                                  </Button>
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
        </div>
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

      {/* Delete Booking Confirmation */}
      <Dialog open={deleteBookingOpen} onOpenChange={setDeleteBookingOpen}>
        <DialogContent data-ocid="bookings.delete_booking.dialog">
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete this booking? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="bookings.delete_booking.cancel_button"
              onClick={() => setDeleteBookingOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="bookings.delete_booking.confirm_button"
              disabled={deletingBooking}
              onClick={handleDeleteBooking}
            >
              {deletingBooking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={createInvoiceOpen} onOpenChange={setCreateInvoiceOpen}>
        <DialogContent data-ocid="invoices.create_invoice.dialog">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateInvoice} className="space-y-4 pt-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Client User ID *
              </Label>
              <Input
                type="number"
                placeholder="e.g. 2"
                data-ocid="invoices.create_invoice.client_id_input"
                value={invoiceForm.clientUserId}
                onChange={(e) =>
                  setInvoiceForm((p) => ({
                    ...p,
                    clientUserId: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Service Type *
              </Label>
              <Select
                value={invoiceForm.serviceType}
                onValueChange={(v) =>
                  setInvoiceForm((p) => ({ ...p, serviceType: v }))
                }
              >
                <SelectTrigger data-ocid="invoices.create_invoice.service_select">
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                  {[
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
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  Amount (₹) *
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 3999"
                  data-ocid="invoices.create_invoice.amount_input"
                  value={invoiceForm.amount}
                  onChange={(e) =>
                    setInvoiceForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  Currency
                </Label>
                <Input
                  placeholder="INR"
                  data-ocid="invoices.create_invoice.currency_input"
                  value={invoiceForm.currency}
                  onChange={(e) =>
                    setInvoiceForm((p) => ({ ...p, currency: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Due Date *
              </Label>
              <Input
                type="date"
                data-ocid="invoices.create_invoice.due_date_input"
                value={invoiceForm.dueDate}
                onChange={(e) =>
                  setInvoiceForm((p) => ({ ...p, dueDate: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Notes</Label>
              <Textarea
                data-ocid="invoices.create_invoice.notes_textarea"
                placeholder="Optional notes for the client..."
                rows={3}
                value={invoiceForm.notes}
                onChange={(e) =>
                  setInvoiceForm((p) => ({ ...p, notes: e.target.value }))
                }
                className="resize-none"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="invoices.create_invoice.cancel_button"
                onClick={() => setCreateInvoiceOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="invoices.create_invoice.submit_button"
                disabled={creatingInvoice}
              >
                {creatingInvoice ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Invoice"
                )}
              </Button>
            </DialogFooter>
          </form>
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

      {/* Feature 2: Full Message View Dialog */}
      <Dialog open={viewMessageOpen} onOpenChange={setViewMessageOpen}>
        <DialogContent data-ocid="leads.view_message.dialog">
          <DialogHeader>
            <DialogTitle>Full Message</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
              {viewMessageText}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="leads.view_message.close_button"
              onClick={() => setViewMessageOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feature 3: Deactivate User AlertDialog */}
      <AlertDialog
        open={deactivateUserOpen}
        onOpenChange={setDeactivateUserOpen}
      >
        <AlertDialogContent data-ocid="users.deactivate_user.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this user? They will no longer
              be able to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="users.deactivate_user.cancel_button"
              onClick={() => {
                setDeactivateUserOpen(false);
                setDeactivateUserId(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="users.deactivate_user.confirm_button"
              onClick={handleDeactivateUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
