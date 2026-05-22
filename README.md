# Timeliner

A fork-able generic timeline static site. Record anything with a date — travel, project history, life events, reading logs.

Built with Astro + TypeScript. One config file to customize everything.

## Fork & Customize

1. Fork this repo
2. Edit `timeliner.config.ts`:

```ts
export default {
  title: 'My Timeline',     // Site title shown in header
  description: '...',       // Subtitle shown in header
  theme: 'chalk',           // chalk | ocean | neon | parchment
  lang: {
    primary: 'zh',          // Primary language code
    secondary: 'en',        // Secondary language, or false to disable
  },
  photos: {
    thumbWidth: 400,        // Thumbnail width in pixels
  },
};
```

## Adding Entries

Create a Markdown file in `src/content/days/`:

```
src/content/days/2026-04-05.md
```

```markdown
---
title: Entry Title
date: 2026-04-05
photos:
  - 2026-04-05/photo1.jpg   # optional
---

Your content here. Full Markdown supported.
```

Entries are sorted newest-first automatically.

## Themes

| Name | Style |
|---|---|
| `chalk` | Dark background, white text, system sans |
| `ocean` | Deep blue background, sky blue accents |
| `neon` | Black background, pink/cyan glow, monospace |
| `parchment` | Warm off-white, brown tones, serif font |

### Custom Theme

1. Create a CSS file in `public/styles/themes/my-theme.css`
2. Copy any built-in theme as a starting point — all available variables are listed there
3. Set `theme: '/styles/themes/my-theme.css'` in config

## Photos

1. Place full-size images in `public/photos/` (organize in subdirectories by date)
2. Run: `bash scripts/gen-thumbs.sh` (requires ImageMagick: `brew install imagemagick`)
3. Reference in frontmatter as `photos: - subfolder/filename.jpg`

Missing images are silently skipped — the build will not fail.

## Bilingual

Set `lang.secondary: false` in config to generate a single-language site. When enabled, `/en/` mirrors the primary page with English date formatting.

## Deploy

```bash
pnpm build    # outputs to dist/
```

Compatible with GitHub Pages, Netlify, Vercel, Cloudflare Pages.
