# My Web Solutions

## Current State
- Home page has a hero section with a generated service image on the right side (no full-width banner)
- Home page has a "Services Preview" section showing 4 service category cards with generated images
- There is no dedicated "Our Projects" section on the Home page
- Hero section uses a soft gradient background, no real photo banner
- Background is currently off-white/light

## Requested Changes (Diff)

### Add
- **"Our Projects" section** on the Home page (new section between Services Preview and Why Choose Us)
  - 5 project cards, each using one of the provided external image URLs:
    1. https://i.postimg.cc/qqF9H4JW/Screenshot_4_3_2026_31339_indu_home_estate_services_v3p_caffeine_xyz.jpg
    2. https://i.postimg.cc/SRPwbkS5/Screenshot_4_3_2026_31458_trustfix_7n5_caffeine_xyz.jpg
    3. https://i.postimg.cc/6qPDxtW1/Screenshot_4_3_2026_31523_nishanth_hc_advocate_website_4qh_caffeine_xyz.jpg
    4. https://i.postimg.cc/kGGkHBmC/Screenshot_4_3_2026_3172_nishanth_hc_advocate_website_4qh_caffeine_xyz.jpg
    5. https://i.postimg.cc/90kvHCmq/Screenshot_4_3_2026_31722_nishanth_hc_advocate_website_4qh_caffeine_xyz.jpg
  - Each project card shows: screenshot image, project name, short description, category tag
  - Subtle hover animation on project cards (scale up image, lift card)
  - Section heading: "Our Projects" with sub-label
- **Hero banner image**: Replace the right-side generated image card with a full hero using the provided banner URL: https://i.postimg.cc/NjXwY9rC/Whats-App-Image-2026-03-04-at-3-12-23-AM.jpg
  - Full-width hero with this image as background
  - Soft dark overlay on the banner image for text readability
  - Hero text (heading, subheading, CTA buttons) remain on top of the banner

### Modify
- **Hero section**: Change from split-layout (text left + card right) to full-width banner with background image and overlay
- **Background**: Keep light professional theme -- white/light grey/soft gradient on non-hero sections
- **Blue brand accents**: Retain throughout

### Remove
- The right-side visual card in the hero (floating chips + service card) -- replaced by full hero banner

## Implementation Plan
1. Update Hero section in Home.tsx:
   - Change hero to full-width layout with banner image as background
   - Add soft semi-transparent dark overlay for text readability
   - Keep heading, subtext, and CTA buttons centered/left-aligned on top
2. Add "Our Projects" section in Home.tsx (after Services Preview, before Why Choose Us):
   - Array of 5 project objects with external image URLs, names, descriptions, tags
   - 5-card grid (3+2 or responsive) with hover animations
   - Each card: image thumbnail, project name, tag badge, short description, optional "View" link
3. Ensure rest of the page remains on light professional background
4. Apply deterministic data-ocid markers to project cards and section
