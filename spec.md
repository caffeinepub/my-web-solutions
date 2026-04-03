# My Web Solutions — Batch 3: Dashboard Improvements

## Current State
- AdminDashboard has a basic bar chart on the Analytics tab showing leads & requests breakdown (5 bars), plus stat cards.
- StaffDashboard has a task completion progress bar but no priority system for individual requests. Requests table shows status but no urgency/priority.
- ClientDashboard shows status badges (Pending/In Progress/Completed) but no visual project stage tracker or stepper UI.

## Requested Changes (Diff)

### Add
- **Admin – Analytics tab**: Add a second chart (Pie/Donut) showing service request distribution by status. Add a third chart showing bookings by status as a horizontal bar. Add a summary "insight" line (e.g., % resolved leads, % completed requests).
- **Staff – Priority system**: Add a `priority` field (High / Medium / Low) that staff can set per request. Displayed as a colored badge in the requests table and visible in overview. Persisted in localStorage (frontend-only, since backend has no priority field). Add a priority filter pill alongside the existing status filter.
- **Client – Progress Tracker**: Add a visual multi-step progress stepper on the Overview and Requests tabs, showing project stages: Submitted → Under Review → In Progress → Completed. Current stage is determined by the service request status. Displayed per-request below the status badge.

### Modify
- AdminDashboard Analytics tab: expand with 2 more chart cards below the existing bar chart.
- StaffDashboard Requests tab: add priority badge column, priority edit button, and priority filter pills.
- ClientDashboard Overview and Requests tabs: add stepper/progress tracker under each request card.

### Remove
- Nothing removed.

## Implementation Plan
1. **AdminDashboard**: Add `PieChart`/`RadialBarChart` from recharts for request status distribution. Add `BarChart` for bookings by status. Add insight summary line above charts.
2. **StaffDashboard**: Add `priority` state map (requestId → priority) in localStorage. Add `PriorityBadge` component. Add priority column in table with an edit select. Add priority filter pills (All / High / Medium / Low) that can combine with status filter.
3. **ClientDashboard**: Add `ProjectProgressStepper` component with 4 stages. Map ServiceRequestStatus to step index. Render inline below each request card on both Overview and Requests tabs.
