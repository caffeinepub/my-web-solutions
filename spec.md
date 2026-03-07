# My Web Solutions

## Current State
- CaseStudies page exists at /case-studies with 5 projects, category filter tabs (All, Web, SaaS, Legal), project detail dialog, and "Request Similar" WhatsApp buttons
- Home page has an "Our Projects" section linking to /case-studies
- CSS was named "Certified Security Supervisor" (now fixed to "Certified Security Specialist")
- CSI was named "Certified Security Inspector" (now fixed to "Certified Security Investigator")
- Certification.tsx, Services.tsx, Home.tsx already updated with corrected names

## Requested Changes (Diff)

### Add
- Dedicated project detail pages at /projects/:id (instead of or in addition to dialog)
- "Request Similar Project" prominent CTA on each detail page
- Stats/metrics section per project (timeline, deliverables, outcome)
- Client testimonial snippet per project (where applicable)

### Modify
- CaseStudies page: upgrade card hover animations (scale, shadow, border highlight)
- CaseStudies page: add "Live Preview" button that opens project image in full screen / lightbox
- CaseStudies page: improve stats strip with better visual treatment
- CaseStudies page: add a "Start Your Project" CTA strip mid-page
- Home "Our Projects" section: show project images with improved card design and hover effects
- Category filter tabs: add count badges per category

### Remove
- Nothing to remove

## Implementation Plan
1. Upgrade CaseStudies page cards with better hover animations, count badges on filter tabs
2. Add full-screen lightbox view for project images (click to expand)
3. Add per-project stats (Timeline, Deliverables, Status) inside detail dialog
4. Add mid-page CTA strip: "Have a project in mind? Let's build it."
5. Improve Home "Our Projects" cards with image zoom and better layout
6. All changes frontend-only, no backend changes needed
