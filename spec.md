# My Web Solutions

## Current State
- Full multi-page website: Home, Services, SaaS, Contact, About, Pricing, Blog, FAQ, Certification, Case Studies
- 3 separate login portals: /admin-login, /staff-login, /client-login
- 3 dashboards with Batch 1 upgrades (analytics, staff assignment, change password, client timeline)
- Contact form stores leads in backend
- WhatsApp floating button (+91 9901563799)
- Dynamic blog (admin can add/edit/delete/publish posts)
- 12 services with images and Book Now / WhatsApp / Email buttons
- Logo and founder photo from uploaded images
- Hero banner from user-provided URL
- Our Projects section with 5 project screenshots
- "Why Choose Us" section on Home page with 3 trust points

## Requested Changes (Diff)

### Add
- "Why Choose Us" section -- enhanced version with more trust signals (already partially exists, needs visual upgrade and more content)
- Partner/Client logos section -- a new horizontal logos row section on Home page showing 3-4 sample client industry icons/logos (no real client logos, so use professional placeholder brand marks)
- Awards & Certifications badges section on Home page -- showcasing Mounith's credentials: Corp International Accredited Advisor, 11+ Years Experience, Wells Fargo Alumni, Samsung Semiconductor Alumni
- Newsletter signup section on Home page and Footer -- a simple email input + subscribe button (frontend only, stores email in backend)
- Meta titles/descriptions for all pages -- add document title + meta description via useEffect in each page component
- New backend function: subscribeNewsletter(email: Text) -> async Result -- stores subscriber emails
- New page: /newsletter-unsubscribe (simple confirmation page)

### Modify
- Home page: Add Partners/Clients logos strip section between Projects and Why Choose Us
- Home page: Add Awards & Certifications badges section after Why Choose Us
- Home page: Add Newsletter signup section before Footer
- Footer: Add newsletter signup mini-form in footer column
- All public pages: Add useEffect to set document.title and meta description
- Backend: Add newsletter subscriber storage and subscribeNewsletter function

### Remove
- Nothing removed

## Implementation Plan
1. Add `subscribeNewsletter` and `getNewsletterSubscribers` to backend (main.mo)
2. Add `useSubscribeNewsletter` hook to useQueries.ts / backend.d.ts
3. Create NewsletterSignup component (reusable, used in Home + Footer)
4. Update Home.tsx:
   - Add Partners/Logos section (industry icons with placeholder client names)
   - Upgrade Why Choose Us section (more trust points, richer layout)
   - Add Awards & Certifications badges section
   - Add Newsletter signup section
5. Update Footer.tsx: add newsletter mini-form
6. Add meta title/description useEffect to all public page components (Home, Services, SaaS, Contact, About, Pricing, Blog, FAQ, Certification, CaseStudies)
7. Validate and deploy
