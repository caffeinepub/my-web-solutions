# My Web Solutions — Batch 5: Business Features

## Current State
- Client Dashboard has an Invoices tab showing invoice cards (service type, amount, due date, paid/unpaid status). No PDF download option exists.
- Admin Dashboard Leads tab displays a table of all leads with name, phone, service, message, status, date, and a status-update select. No WhatsApp quick-message button exists on leads.
- Admin Dashboard Bookings tab already has a WhatsApp Notify button when a booking is confirmed (pre-built pattern to follow).

## Requested Changes (Diff)

### Add
- **Invoice PDF Download** (Client Dashboard → Invoices tab): A "Download PDF" button on each invoice card that generates a styled PDF (using browser-native print-to-PDF via a hidden iframe / window.print approach, or jsPDF canvas approach) containing invoice details: My Web Solutions header, invoice ID, client name, service type, amount, due date, status, issue date, notes.
- **WhatsApp Templates for Leads** (Admin Dashboard → Leads tab): A WhatsApp icon button per lead row that opens a pre-filled WhatsApp message in a new tab. The template should read: "Hi [name], thank you for reaching out about [service]. We've received your inquiry and will get back to you shortly. - My Web Solutions" directed to +91[phone].

### Modify
- Client Dashboard invoice card: add a "Download PDF" button (outline, small) in the bottom-right of each invoice card.
- Admin Dashboard leads table: add a "WhatsApp" action column or append a WhatsApp button to the existing Update column next to the status select.

### Remove
- Nothing removed.

## Implementation Plan
1. **Invoice PDF**: Use `jsPDF` (or a canvas-based approach with `html2canvas` + `jsPDF`) to generate a PDF from invoice data. Add a `downloadInvoicePDF` helper function that constructs a styled PDF document and triggers download. Add a Download button to each invoice card in `ClientDashboard.tsx`. If jsPDF is not available, use a pure CSS print approach via a hidden div and `window.print()`.
2. **WhatsApp Lead Templates**: In `AdminDashboard.tsx`, add a green WhatsApp button per lead row. Construct the URL: `https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(template)}`. Place button in the leads table next to the status select (new "WhatsApp" column or inline).
3. Validate, build, and deploy.
