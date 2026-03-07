# My Web Solutions

## Current State
- Blog page (`/blog`) shows all published posts in a grid with no filtering or search
- Blog post page (`/blog/$id`) shows individual post content
- BlogPost type in backend: `{ id, title, content, excerpt, authorName, createdAt, updatedAt, isPublished }`
- No category field in backend data model
- No search, no related posts, no social share buttons

## Requested Changes (Diff)

### Add
- **Blog Categories** (frontend-only, keyword-based inference): Security, Technology, Government Services, Career, SaaS, General
  - Category filter tabs on `/blog` listing page
  - Each post card shows a category badge (inferred from title/content/excerpt keywords)
  - Category filter persists via URL search param `?category=`
- **Search bar** on `/blog` with real-time filtering by title and excerpt
- **Related Posts** section at the bottom of `/blog/$id` (same inferred category, excluding current post, max 3)
- **Social Share buttons** on `/blog/$id`: WhatsApp, Twitter/X, LinkedIn, Copy Link
  - Toast feedback on "Copy Link"
- Admin blog form: add a `category` select dropdown (stored as prefix in title or separate tag field -- since backend has no category field, store as a tag in the excerpt or use a convention like `[Category] Title`)
  - Actually: infer category automatically from content keywords, no backend change needed

### Modify
- `Blog.tsx`: add search input, category filter tabs, filtered grid
- `BlogPost.tsx`: add Related Posts section, Social Share buttons

### Remove
- Nothing removed

## Implementation Plan
1. Create a `getBlogCategory(post)` utility function that infers category from title/content/excerpt keywords
2. Update `Blog.tsx`:
   - Add search input (filter by title + excerpt)
   - Add category filter tabs (All, Security, Technology, Government Services, Career, SaaS, General)
   - Apply both filters together
   - Show category badge on each post card
3. Update `BlogPost.tsx`:
   - Add Social Share section (WhatsApp share, Twitter/X share, LinkedIn share, Copy Link)
   - Add Related Posts section at bottom (same category, max 3, using `useListBlogPosts`)
4. No backend changes required
