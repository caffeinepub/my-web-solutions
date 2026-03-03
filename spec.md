# My Web Solutions

## Current State
Full app is built and working: public website, 3 login portals (admin/staff/client), dashboards, leads management, blog, service requests. The only broken part is the admin login. The seeded admin user stores `passwordHash = "admin123"` (plain text), but the frontend hashes passwords with SHA-256 before sending to the backend. So the comparison always fails.

## Requested Changes (Diff)

### Add
- Fresh admin seed with correct SHA-256 hash of password `Admin@123`
- Admin user email field added to User type

### Modify
- Replace seeded admin user: username=admin, email=mywebsolutions97@gmail.com, password hash = SHA-256 of "Admin@123" = `e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7`
- Admin role must have full permissions (all existing admin guards stay)

### Remove
- Old admin seed with plain-text password `admin123`

## Implementation Plan
1. Regenerate backend keeping ALL existing logic intact (leads, users, blog, service requests, authorization)
2. Change only the seed admin: username="admin", passwordHash = SHA-256 of "Admin@123", role=#admin, isActive=true
3. Add optional email field to User type for the admin record
4. No frontend changes needed -- hashPassword() in auth.ts already uses SHA-256 correctly
