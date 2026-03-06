# My Web Solutions

## Current State
- Multi-page public website (Home, Services, SaaS, Contact, About, Pricing, Blog)
- 3 separate login portals: /admin-login, /staff-login, /client-login
- Admin Dashboard: Overview stats, Leads, Service Requests, Blog, Users tabs
- Staff Dashboard: Overview stats, Service Requests table with status updates
- Client Dashboard: Overview, My Requests, Invoices (placeholder)
- Backend supports: users, leads, blog posts, service requests, login, initAdmin

## Requested Changes (Diff)

### Add
- **Backend**: `changePassword(userId, oldPasswordHash, newPasswordHash)` -- lets any logged-in user change their own password
- **Backend**: `adminResetPassword(userId, newPasswordHash)` -- admin-only password reset for any user
- **Backend**: `getRevenueStats()` -- returns total leads, total service requests, breakdown by status (pending/inProgress/completed), monthly counts for last 6 months
- **Backend**: `getStaffAssignedClients(staffUserId)` -- returns list of clients assigned to a staff member (new assignedStaffId field on ServiceRequest)
- **Backend**: `assignStaffToRequest(requestId, staffUserId)` -- admin assigns a staff member to a service request
- **Admin Dashboard**: "Analytics" tab with revenue/leads chart (bar chart for last 6 months leads + requests), status breakdown pie-style cards
- **Admin Dashboard**: Assign Staff button per service request row
- **Admin Dashboard**: "Change Password" option in sidebar for admin user
- **Staff Dashboard**: "My Clients" tab showing clients whose service requests are assigned to this staff member
- **Staff Dashboard**: Task/note field per request (staff can add a note/update)
- **Client Dashboard**: Service history timeline view (requests sorted by date with status progression)
- **Client Dashboard**: "Change Password" section in a new "Profile" tab
- Password change form (current password + new password + confirm) -- shared component used in both Admin and Client dashboards

### Modify
- `ServiceRequest` type: add optional `assignedStaffId: ?Nat` and `staffNote: Text` fields
- `updateServiceRequestStatus`: keep as-is
- Admin Service Requests tab: add "Assign Staff" column with staff dropdown
- Staff Dashboard Overview: show "My Assigned Requests" count separately
- Client Dashboard: add "Profile" tab to sidebar nav

### Remove
- Nothing removed

## Implementation Plan
1. Update backend `main.mo`:
   - Add `assignedStaffId: ?Nat` and `staffNote: Text` to `ServiceRequest` type
   - Add `changePassword`, `adminResetPassword`, `assignStaffToRequest`, `addStaffNote`, `getRevenueStats` functions
2. Frontend -- Admin Dashboard:
   - Add "Analytics" tab: stat cards + bar chart (last 6 months) using recharts
   - Add "Assign Staff" column to Service Requests table
   - Add "Change Password" modal accessible from sidebar
3. Frontend -- Staff Dashboard:
   - Add "My Clients" tab: list unique clients from assigned requests
   - Add staff note field per request row
4. Frontend -- Client Dashboard:
   - Add "Profile" tab with Change Password form
   - Service history: sort requests by date, show timeline-style layout
5. Add shared ChangePasswordForm component
6. Wire new backend hooks in useQueries.ts
