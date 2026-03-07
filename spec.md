# My Web Solutions

## Current State
The Staff Dashboard has:
- Overview tab with 4 stat cards (Total, Pending, In Progress, Completed) and recent requests list
- Service Requests tab with full table, status update select, and staff note editor
- My Clients tab showing client cards derived from assigned requests

## Requested Changes (Diff)

### Add
- WhatsApp button per client card in the My Clients tab (opens chat with client phone if available, or a WhatsApp generic link)
- Task completion progress bar in the Overview tab showing % of requests completed
- Status filter pills (All / Pending / In Progress / Completed) on the Service Requests tab to filter the table
- Upcoming Bookings view — a new sidebar tab "Upcoming Bookings" showing bookings assigned/relevant to staff (uses listBookings, filtered to show only pending/confirmed ones, all visible to staff)

### Modify
- Overview tab: add a visual progress bar showing completion percentage below the stat cards
- Service Requests tab: add filter pills above the table for status filtering
- My Clients tab: add a WhatsApp action button on each client card

### Remove
- Nothing removed

## Implementation Plan
1. Add "Upcoming Bookings" tab to sidebar nav in StaffDashboard
2. Add `useListBookings` hook usage in StaffDashboard for the new bookings tab
3. Add status filter state + filter pills UI above the service requests table
4. Add completion progress bar (completed / total %) in Overview section
5. Add WhatsApp button per client card in My Clients tab (links to `https://wa.me/91${phone}` or generic WhatsApp if no phone available — since ServiceRequest has clientName but no phone, use a generic WhatsApp to the business number as fallback, opening with client name pre-filled)
6. Upcoming Bookings tab: show bookings filtered to pending/confirmed status in a clean card grid with status badge, name, service, date, time
