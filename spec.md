# My Web Solutions - Batch 1: Performance & SEO

## Current State
The project is a multi-page React/TypeScript SaaS website with the following pages:
- Home, Services, SaaS, About, Contact, Blog, BlogPost, FAQ, Booking, Certification, CaseStudies, Pricing
- Admin/Staff/Client Login and Dashboard pages
- Existing images in /public/assets/generated/ directory
- No SEO meta tags, Open Graph tags, or structured data
- No sitemap.xml or robots.txt
- Images loaded without lazy loading

## Requested Changes (Diff)

### Add
- A reusable `SEOHead` component using React Helmet (or document.title + meta manipulation) that accepts title, description, keywords, and OG tags props
- Unique meta title + description for every page: Home, Services, SaaS, About, Contact, Blog, FAQ, Booking, Certification, CaseStudies, Pricing
- Open Graph tags: og:title, og:description, og:type, og:url, og:image on all pages
- Twitter Card meta tags on all pages
- `public/sitemap.xml` listing all public page URLs
- `public/robots.txt` with sitemap reference and allow all crawlers
- `loading="lazy"` attribute on all `<img>` tags across all page components

### Modify
- All page components to include the SEOHead component at the top
- All `<img>` tags to include `loading="lazy"` prop

### Remove
- Nothing removed

## Implementation Plan
1. Create a `SEOHead` component in `src/frontend/src/components/SEOHead.tsx` using `useEffect` + `document.title` + injecting meta tags dynamically (no external dependency needed)
2. Add SEOHead to each page with unique title, description, keywords, and OG image
3. Scan all page and component files and add `loading="lazy"` to all `<img>` tags
4. Create `src/frontend/public/sitemap.xml` with all public routes
5. Create `src/frontend/public/robots.txt`
