# My Web Solutions

## Current State

- Multi-page public website: Home, Services, SaaS, Contact, About Us
- 3 separate login portals: /admin-login, /staff-login, /client-login
- 3 dashboards: Admin (Leads + Users), Staff (blank), Client (blank)
- Backend: leads storage, user management, login with role-based access
- WhatsApp button (placeholder number)
- 12 services listed on Services page
- Founder profile on About Us

## Requested Changes (Diff)

### Add

- **Pricing page** (/pricing): Transparent pricing table with 3 categories:
  - Website Development: Basic ₹3,999 / Business ₹7,999 / E-commerce ₹14,999
  - SaaS Service Management System: Starting ₹34,999 (Hosting & Domain separate)
  - Documentation & Certification: Contact for pricing (with WhatsApp CTA)
- **Testimonials section** on Home page: 3 sample star-rated reviews
- **Blog system**: Public /blog page listing posts; individual /blog/:id post page; Admin dashboard "Blog" tab with Add/Edit/Delete post capability
- **Backend: BlogPost type** with id, title, content, excerpt, authorName, createdAt, updatedAt fields
- **Backend functions**: createBlogPost, updateBlogPost, deleteBlogPost, listBlogPosts, getBlogPost
- **Backend: ServiceRequest type** with id, clientUserId, serviceType, status (Pending/InProgress/Completed), description, createdAt
- **Backend functions**: createServiceRequest, getClientServiceRequests, updateServiceRequestStatus, listAllServiceRequests
- **Client Dashboard upgrade**: Show own service requests with status badges; Invoice placeholder view; WhatsApp support button
- **Staff Dashboard upgrade**: Show assigned client list, service requests overview
- **Admin Dashboard new tabs**: Blog management tab; Service Requests tab to view/update all requests

### Modify

- **WhatsApp number**: Replace all placeholder numbers with +91 9901563799 across all pages, buttons, and contact info
- **Home page**: Add Testimonials section with 3 sample reviews
- **Admin Dashboard**: Add Blog tab and Service Requests tab alongside existing Leads and Users tabs
- **Navbar/Footer**: Add Pricing and Blog links

### Remove

- Nothing removed

## Implementation Plan

1. Update backend (main.mo) to add BlogPost and ServiceRequest data models with full CRUD functions
2. Regenerate backend.d.ts
3. Build Pricing page (/pricing) with clear pricing cards and WhatsApp CTA
4. Add Testimonials section to Home page
5. Build public Blog list page (/blog) and Blog post detail page (/blog/:id)
6. Add Blog management tab to Admin Dashboard (create, edit, delete posts)
7. Add Service Requests tab to Admin Dashboard
8. Upgrade Client Dashboard: service requests list with status, invoice placeholder, WhatsApp button
9. Upgrade Staff Dashboard: assigned clients and service requests view
10. Fix WhatsApp number to +91 9901563799 everywhere
11. Add Pricing and Blog links to Navbar and Footer
