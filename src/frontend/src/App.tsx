import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { About } from "@/pages/About";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminLogin } from "@/pages/AdminLogin";
import { Blog } from "@/pages/Blog";
import { BlogPostPage } from "@/pages/BlogPost";
import { ClientDashboard } from "@/pages/ClientDashboard";
import { ClientLogin } from "@/pages/ClientLogin";
import { Contact } from "@/pages/Contact";
// Pages
import { Home } from "@/pages/Home";
import { Pricing } from "@/pages/Pricing";
import { SaaS } from "@/pages/SaaS";
import { Services } from "@/pages/Services";
import { StaffDashboard } from "@/pages/StaffDashboard";
import { StaffLogin } from "@/pages/StaffLogin";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// Public routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: Services,
});

const saasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/saas",
  component: SaaS,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: Contact,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: Pricing,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: Blog,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$id",
  component: BlogPostPage,
});

// Auth routes
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-login",
  component: AdminLogin,
});

const staffLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff-login",
  component: StaffLogin,
});

const clientLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client-login",
  component: ClientLogin,
});

// Dashboard routes
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-dashboard",
  component: AdminDashboard,
});

const staffDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff-dashboard",
  component: StaffDashboard,
});

const clientDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client-dashboard",
  component: ClientDashboard,
});

// Router
const routeTree = rootRoute.addChildren([
  homeRoute,
  servicesRoute,
  saasRoute,
  contactRoute,
  aboutRoute,
  pricingRoute,
  blogRoute,
  blogPostRoute,
  adminLoginRoute,
  staffLoginRoute,
  clientLoginRoute,
  adminDashboardRoute,
  staffDashboardRoute,
  clientDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
