# My Web Solutions

## Current State
The Footer component uses `bg-navy-deep` (dark navy, OKLCH lightness ~0.18) as background, but the text color is `text-sidebar-foreground` which maps to `--sidebar-foreground: 0.18 0.03 255` -- also very dark (lightness 0.18). This makes all footer text nearly invisible (dark on dark). Social icons, navigation links, contact details, and newsletter section are all affected.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Footer.tsx: Replace all `text-sidebar-foreground/*` and `bg-sidebar-foreground/*` and `border-sidebar-foreground/*` classes with proper light equivalents that are readable on dark navy background
- Specifically: text should be white/light variants (`text-white`, `text-white/70`, `text-white/50`, etc.)
- Social icon containers: use `bg-white/10`, `border-white/15`, hover states using teal color
- Footer bottom strip: use `border-white/15` and `text-white/50`
- Newsletter input: use `bg-white/10`, `border-white/20`, `text-white`, `placeholder:text-white/50`

### Remove
- All dark `sidebar-foreground` color references in Footer.tsx

## Implementation Plan
1. Update Footer.tsx -- replace all dark sidebar-foreground color tokens with white/light variants suitable for a dark navy background
2. Ensure social icons, nav links, contact info, newsletter, and bottom bar are all clearly visible
3. Verify all hover states still work correctly
