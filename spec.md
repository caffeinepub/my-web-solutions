# My Web Solutions

## Current State

Full multi-page website with:
- Public pages: Home, Services, SaaS, Contact, About, Pricing, Blog, FAQ, Certifications, Case Studies
- 3 separate login portals: /admin-login, /staff-login, /client-login
- 3 dashboards: Admin (analytics, leads, users, service requests, blog), Staff (assigned clients, requests, notes), Client (requests timeline, invoices, change password)
- Dynamic blog system (admin-controlled)
- WhatsApp floating button (+91 9901563799)
- Contact form storing leads in backend
- Authorization system with role-based access
- Backend functions: submitLead, getLeads, updateLeadStatus, login, createUser, listUsers, toggleUserActive, blog CRUD, service request CRUD, assignStaff, addStaffNote, changePassword, adminResetPassword, getRevenueStats, getStaffAssignedRequests, initAdmin

## Requested Changes (Diff)

### Add
- Appointment booking form (public page at /book or as a section on Contact/Home)
  - Fields: Name, Phone, Email, Service (dropdown), Preferred Date, Preferred Time, Message
  - Stores booking in backend database
- Admin: Bookings tab in admin dashboard to view all bookings
  - Can confirm or reject each booking
  - Can update booking status: Pending, Confirmed, Rejected, Completed
- WhatsApp confirmation: when admin confirms a booking, a pre-filled WhatsApp message link is shown to admin to notify the client
- Backend: Booking type, createBooking, listBookings, updateBookingStatus functions

### Modify
- Admin dashboard: add Bookings tab
- Contact page or Home page: add Book Appointment section/button linking to booking form
- Navbar: add "Book Now" link

### Remove
- Nothing removed

## Implementation Plan

1. Backend: Add Booking type, createBooking (public), listBookings (admin), updateBookingStatus (admin) to main.mo
2. Regenerate backend to get updated backend.d.ts
3. Frontend:
   - New page /booking: Appointment booking form with all fields, stores in backend, success confirmation
   - AdminDashboard: add Bookings tab with table, status update, WhatsApp confirmation link per row
   - Navbar: add "Book Now" CTA button
   - Contact page: add "Book an Appointment" button linking to /booking
