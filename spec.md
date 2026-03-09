# My Web Solutions

## Current State
- Full multi-page website with public pages (Home, Services, SaaS, Contact, About, Pricing, Blog, FAQ, Certifications, Case Studies)
- 3 separate login portals: /admin-login, /staff-login, /client-login
- Admin Dashboard with Leads, Users, Service Requests, Blog, Bookings, Analytics tabs
- Staff Dashboard with Overview, My Requests (filter pills), My Clients (WhatsApp per client), Upcoming Bookings
- Client Dashboard with Overview, My Requests (timeline), Invoices (placeholder), Profile (change password)
- Backend has: leads, users, serviceRequests, bookings, blogPosts; all CRUD operations working

## Requested Changes (Diff)

### Add
- Invoice creation system: Admin can create invoices for clients (linked to a service request or standalone)
- Invoice backend storage: invoiceId, clientUserId, serviceType, amount, currency, status (unpaid/paid), createdAt, dueDate, notes
- Invoice tab in Client Dashboard: client can view invoices sent by admin, with amount, status, service, date
- Request cancel feature: client can cancel a pending service request (only if status = pending)
- Assigned staff name display: on each request card in client dashboard, show the assigned staff member's username if assignedStaffId is set
- Notification center in Client Dashboard: a sidebar bell icon showing status change activity (new items when requests transition to inProgress or completed)

### Modify
- ClientDashboard.tsx: upgrade Invoices tab from placeholder to real invoice list; add cancel button on pending requests; show assigned staff name on request cards; add notification bell in sidebar
- Backend main.mo: add Invoice type, storage, createInvoice (admin only), listClientInvoices (client or admin), updateInvoiceStatus (admin only)
- useQueries.ts: add hooks for useCreateInvoice, useListClientInvoices, useUpdateInvoiceStatus, useCancelServiceRequest
- backend.d.ts: will be updated automatically after backend generation

### Remove
- Nothing removed

## Implementation Plan
1. Update backend (main.mo) to add Invoice system and cancelServiceRequest function
2. Update frontend ClientDashboard.tsx:
   - Invoices tab: fetch and display real invoices from backend
   - My Requests: add Cancel button on pending items, show assigned staff name
   - Sidebar: add notification bell with unread count badge
   - Notifications panel: list recent status changes (derived from request updatedAt vs last-seen timestamp in localStorage)
3. Update useQueries.ts with new hooks
4. Validate and deploy
