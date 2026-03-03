import { LeadStatus, Role } from "@/backend.d";
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
  useCreateUser,
  useGetLeads,
  useListUsers,
  useToggleUserActive,
  useUpdateLeadStatus,
} from "@/hooks/useQueries";
import { clearSession, getSession } from "@/utils/auth";
import { useNavigate } from "@tanstack/react-router";
import {
  Globe,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  ShieldCheck,
  UserCheck,
  UserCircle2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Tab = "overview" | "leads" | "users";

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

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [createOpen, setCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: Role.client as Role,
  });

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
  const { mutate: updateStatus } = useUpdateLeadStatus();
  const { mutate: toggleActive } = useToggleUserActive();
  const { mutateAsync: createUser, isPending: creatingUser } = useCreateUser();

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
      const { hashPassword } = await import("@/utils/auth");
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

  const activeUsers = users.filter((u) => u.isActive).length;

  const navItems = [
    {
      id: "overview" as Tab,
      label: "Overview",
      icon: LayoutDashboard,
      ocid: "admin_dashboard.overview_tab",
    },
    {
      id: "leads" as Tab,
      label: "Leads",
      icon: MessageSquare,
      ocid: "admin_dashboard.leads_tab",
    },
    {
      id: "users" as Tab,
      label: "Users",
      icon: Users,
      ocid: "admin_dashboard.users_tab",
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
              <item.icon className="w-4 h-4" />
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
        {/* Overview Tab */}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Leads Tab */}
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

        {/* Users Tab */}
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
                        <SelectTrigger>
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
    </div>
  );
}
