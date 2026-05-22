# Timeliner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fork-able generic timeline static site with Astro + TypeScript, supporting 4 built-in themes (chalk, ocean, neon, parchment), optional photos, and optional bilingual output.

**Architecture:** Astro content collections hold Markdown entries in `src/content/days/YYYY-MM-DD.md`. A single `timeliner.config.ts` at the root controls everything. Themes are static CSS files in `public/styles/themes/` linked via `<link>`, while `src/styles/global.css` is imported in `BaseLayout.astro` and bundled by Vite.

**Tech Stack:** Astro 6, TypeScript (strict), pnpm, Vitest

---

## File Map

| Path | Responsibility |
|---|---|
| `timeliner.config.ts` | Single user-facing config (title, theme, lang, photos) |
| `src/types/config.ts` | TypeScript type for config |
| `src/content/config.ts` | Astro collection definition (imports schema) |
| `src/content/schema.ts` | Zod schema (standalone, testable without astro:content) |
| `src/content/days/*.md` | Sample entries |
| `src/utils/theme.ts` | `resolveThemeHref()` — converts theme name/path to CSS URL |
| `src/utils/content.ts` | `sortByDateDesc()` + `getSortedEntries()` |
| `src/utils/theme.test.ts` | Vitest tests for theme resolution |
| `src/utils/content.test.ts` | Vitest tests for sort logic |
| `src/utils/schema.test.ts` | Vitest tests for Zod schema |
| `src/styles/global.css` | Layout/structure CSS (CSS vars only, no colors) |
| `public/styles/themes/chalk.css` | Dark minimal theme |
| `public/styles/themes/ocean.css` | Deep blue theme |
| `public/styles/themes/neon.css` | Cyberpunk glow theme |
| `public/styles/themes/parchment.css` | Warm journal theme |
| `src/layouts/BaseLayout.astro` | HTML shell, imports global.css, links theme |
| `src/components/Header.astro` | Site title + optional lang switcher |
| `src/components/PhotoGrid.astro` | Optional photo grid |
| `src/components/Entry.astro` | Single timeline entry (node + connector + content) |
| `src/components/Timeline.astro` | Maps entries to Entry components |
| `src/pages/index.astro` | Primary language page |
| `src/pages/en/index.astro` | Secondary language page (redirects if disabled) |
| `scripts/gen-thumbs.sh` | ImageMagick thumbnail generator |
| `README.md` | Fork guide |

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `astro.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Initialize git**

```bash
cd /Users/zxc/Documents/programming/timeliner
git init
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "timeliner",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^6.2.1"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 3: Create `astro.config.ts`**

```ts
import { defineConfig } from 'astro/config';

export default defineConfig({});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 6: Create `.gitignore`**

```
dist/
node_modules/
.astro/
.env
.env.*
!.env.example
public/photos-thumb/
.superpowers/
```

- [ ] **Step 7: Install dependencies**

```bash
pnpm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 8: Commit**

```bash
git add package.json astro.config.ts tsconfig.json vitest.config.ts .gitignore
git commit -m "chore: scaffold Astro project"
```

---

## Task 2: Config type + timeliner.config.ts

**Files:**
- Create: `src/types/config.ts`
- Create: `timeliner.config.ts`

- [ ] **Step 1: Create `src/types/config.ts`**

```bash
mkdir -p src/types
```

```ts
export interface TimelinerConfig {
  title: string;
  description: string;
  /** Built-in theme name (chalk | ocean | neon | parchment) or absolute URL path to a CSS file */
  theme: string;
  lang: {
    primary: string;
    /** Set to false to disable the secondary language page */
    secondary: string | false;
  };
  photos: {
    thumbWidth: number;
  };
}
```

- [ ] **Step 2: Create `timeliner.config.ts`**

```ts
import type { TimelinerConfig } from './src/types/config';

const config: TimelinerConfig = {
  title: 'My Timeline',
  description: 'A personal record',
  theme: 'chalk',
  lang: {
    primary: 'zh',
    secondary: 'en',
  },
  photos: {
    thumbWidth: 400,
  },
};

export default config;
```

- [ ] **Step 3: Commit**

```bash
git add src/types/config.ts timeliner.config.ts
git commit -m "feat: add config type and default timeliner.config.ts"
```

---

## Task 3: Content schema + sample entries

**Files:**
- Create: `src/content/schema.ts`
- Create: `src/content/config.ts`
- Create: `src/content/days/2026-04-05.md`
- Create: `src/content/days/2026-04-03.md`
- Create: `src/content/days/2026-03-20.md`

- [ ] **Step 1: Create `src/content/schema.ts`**

```bash
mkdir -p src/content/days
```

```ts
import { z } from 'zod';

export const daySchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  photos: z.array(z.string()).optional(),
});
```

- [ ] **Step 2: Create `src/content/config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { daySchema } from './schema';

const days = defineCollection({
  type: 'content',
  schema: daySchema,
});

export const collections = { days };
```

- [ ] **Step 3: Create `src/content/days/2026-04-05.md`**

```markdown
---
title: 项目启动
date: 2026-04-05
---

这是第一条示例记录。在 `src/content/days/` 目录下以 `YYYY-MM-DD.md` 格式添加文件，每个文件对应一条时间线记录。

支持完整的 **Markdown** 语法。
```

- [ ] **Step 4: Create `src/content/days/2026-04-03.md`**

```markdown
---
title: 准备阶段
date: 2026-04-03
photos:
  - sample/demo.jpg
---

这条记录包含图片字段。将图片放入 `public/photos/sample/` 目录，运行 `bash scripts/gen-thumbs.sh` 生成缩略图。

缺失的图片会被静默跳过，不影响构建。
```

- [ ] **Step 5: Create `src/content/days/2026-03-20.md`**

```markdown
---
title: 最初的想法
date: 2026-03-20
---

时间线的第一个节点。记录可以是任何东西——旅行、项目历程、读书笔记、人生大事。
```

- [ ] **Step 6: Commit**

```bash
git add src/content/
git commit -m "feat: add content schema and sample entries"
```

---

## Task 4: Utility functions + tests

**Files:**
- Create: `src/utils/theme.ts`
- Create: `src/utils/theme.test.ts`
- Create: `src/utils/content.ts`
- Create: `src/utils/content.test.ts`
- Create: `src/utils/schema.test.ts`

- [ ] **Step 1: Write failing tests for theme resolution**

```bash
mkdir -p src/utils
```

Create `src/utils/theme.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { resolveThemeHref } from './theme';

describe('resolveThemeHref', () => {
  it('resolves built-in theme name to /styles/themes path', () => {
    expect(resolveThemeHref('chalk')).toBe('/styles/themes/chalk.css');
    expect(resolveThemeHref('ocean')).toBe('/styles/themes/ocean.css');
    expect(resolveThemeHref('neon')).toBe('/styles/themes/neon.css');
    expect(resolveThemeHref('parchment')).toBe('/styles/themes/parchment.css');
  });

  it('passes through a custom URL path unchanged', () => {
    expect(resolveThemeHref('/styles/themes/custom.css')).toBe('/styles/themes/custom.css');
  });

  it('returns unknown names as-is (treats as URL)', () => {
    expect(resolveThemeHref('https://example.com/theme.css')).toBe('https://example.com/theme.css');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test
```

Expected: FAIL — `Cannot find module './theme'`

- [ ] **Step 3: Create `src/utils/theme.ts`**

```ts
const BUILTIN_THEMES = ['chalk', 'ocean', 'neon', 'parchment'] as const;

export function resolveThemeHref(theme: string): string {
  if ((BUILTIN_THEMES as readonly string[]).includes(theme)) {
    return `/styles/themes/${theme}.css`;
  }
  return theme;
}
```

- [ ] **Step 4: Write failing tests for sort utility**

Create `src/utils/content.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { sortByDateDesc } from './content';

describe('sortByDateDesc', () => {
  it('sorts entries newest first', () => {
    const entries = [
      { data: { title: 'Old', date: new Date('2026-01-01') } },
      { data: { title: 'New', date: new Date('2026-06-01') } },
      { data: { title: 'Mid', date: new Date('2026-03-01') } },
    ];
    const sorted = sortByDateDesc(entries);
    expect(sorted[0].data.title).toBe('New');
    expect(sorted[1].data.title).toBe('Mid');
    expect(sorted[2].data.title).toBe('Old');
  });

  it('does not mutate the input array', () => {
    const entries = [
      { data: { title: 'A', date: new Date('2026-01-01') } },
      { data: { title: 'B', date: new Date('2026-06-01') } },
    ];
    sortByDateDesc(entries);
    expect(entries[0].data.title).toBe('A');
  });

  it('handles a single entry', () => {
    const entries = [{ data: { title: 'Only', date: new Date('2026-04-05') } }];
    expect(sortByDateDesc(entries)).toHaveLength(1);
  });
});
```

- [ ] **Step 5: Write failing schema tests**

Create `src/utils/schema.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { daySchema } from '../content/schema';

describe('daySchema', () => {
  it('parses a valid entry with title and date string', () => {
    const result = daySchema.parse({ title: 'Test', date: '2026-04-05' });
    expect(result.title).toBe('Test');
    expect(result.date).toBeInstanceOf(Date);
    expect(result.date.getFullYear()).toBe(2026);
  });

  it('accepts optional photos array', () => {
    const result = daySchema.parse({
      title: 'Test',
      date: '2026-04-05',
      photos: ['folder/img.jpg'],
    });
    expect(result.photos).toEqual(['folder/img.jpg']);
  });

  it('photos defaults to undefined when omitted', () => {
    const result = daySchema.parse({ title: 'Test', date: '2026-04-05' });
    expect(result.photos).toBeUndefined();
  });

  it('rejects missing title', () => {
    expect(() => daySchema.parse({ date: '2026-04-05' })).toThrow();
  });

  it('rejects invalid date string', () => {
    expect(() => daySchema.parse({ title: 'Test', date: 'not-a-date' })).toThrow();
  });
});
```

- [ ] **Step 6: Run all tests to confirm they fail**

```bash
pnpm test
```

Expected: FAIL on content.ts and schema imports

- [ ] **Step 7: Create `src/utils/content.ts`**

```ts
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getSortedEntries(): Promise<CollectionEntry<'days'>[]> {
  const entries = await getCollection('days');
  return sortByDateDesc(entries);
}
```

- [ ] **Step 8: Run tests**

```bash
pnpm test
```

Expected: all tests PASS

- [ ] **Step 9: Commit**

```bash
git add src/utils/
git commit -m "feat: add theme and content utilities with tests"
```

---

## Task 5: CSS — global layout + 4 themes

**Files:**
- Create: `src/styles/global.css`
- Create: `public/styles/themes/chalk.css`
- Create: `public/styles/themes/ocean.css`
- Create: `public/styles/themes/neon.css`
- Create: `public/styles/themes/parchment.css`

- [ ] **Step 1: Create `src/styles/global.css`**

```bash
mkdir -p src/styles
mkdir -p public/styles/themes
```

```css
*, *::before, *::after { box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-body);
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.site-header {
  padding: 2rem 1rem 1rem;
  max-width: 680px;
  margin: 0 auto;
}

.site-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
}

.site-description {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}

.lang-switch {
  margin-top: 0.5rem;
}

.lang-switch a {
  color: var(--accent);
  font-size: 0.8rem;
  text-decoration: none;
  opacity: 0.8;
}

.lang-switch a:hover {
  opacity: 1;
}

.timeline {
  max-width: 680px;
  margin: 0 auto;
  padding: 1.5rem 1rem 4rem;
}

.entry {
  display: flex;
  gap: 1rem;
  padding-bottom: 2rem;
}

.entry:last-child .entry-connector {
  display: none;
}

.entry-node-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3px;
  flex-shrink: 0;
}

.entry-node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--node-active);
  box-shadow: var(--node-glow, none);
  flex-shrink: 0;
}

.entry-node.faded {
  background: var(--node-inactive);
  box-shadow: none;
}

.entry-connector {
  width: 1px;
  flex: 1;
  min-height: 1.5rem;
  background: var(--line);
  margin-top: 4px;
}

.entry-body {
  flex: 1;
  min-width: 0;
}

.entry-date {
  color: var(--text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.03em;
  margin-bottom: 0.3rem;
}

.entry-title {
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 0.6rem;
}

.entry-content {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.75;
}

.entry-content p { margin: 0 0 0.75rem; }
.entry-content p:last-child { margin-bottom: 0; }

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.photo-grid a {
  display: block;
}

.photo-grid img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
}

@media (max-width: 480px) {
  .timeline { padding: 0.75rem 0.75rem 3rem; }
  .site-header { padding: 1.5rem 0.75rem 0.75rem; }
}
```

- [ ] **Step 2: Create `public/styles/themes/chalk.css`**

```css
:root {
  --bg: #1c1c1c;
  --text-primary: #ffffff;
  --text-secondary: #888888;
  --text-muted: #555555;
  --node-active: #ffffff;
  --node-inactive: #444444;
  --line: #2e2e2e;
  --accent: #ffffff;
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

- [ ] **Step 3: Create `public/styles/themes/ocean.css`**

```css
:root {
  --bg: #0a1628;
  --text-primary: #e0f0ff;
  --text-secondary: #4a7090;
  --text-muted: #2a4060;
  --node-active: #38bdf8;
  --node-inactive: #1e4a6a;
  --line: #1e3a5a;
  --accent: #38bdf8;
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

- [ ] **Step 4: Create `public/styles/themes/neon.css`**

```css
:root {
  --bg: #0d0d0d;
  --text-primary: #ffffff;
  --text-secondary: #555555;
  --text-muted: #333333;
  --node-active: #ff2d78;
  --node-inactive: #00f5d4;
  --node-glow: 0 0 8px #ff2d78;
  --line: #1a1a1a;
  --accent: #ff2d78;
  --font-body: 'Courier New', Courier, monospace;
  --font-heading: 'Courier New', Courier, monospace;
}
```

- [ ] **Step 5: Create `public/styles/themes/parchment.css`**

```css
:root {
  --bg: #f5f0e8;
  --text-primary: #3d2b1a;
  --text-secondary: #7a6040;
  --text-muted: #9e8060;
  --node-active: #8b6f47;
  --node-inactive: #c4a882;
  --line: #d4c4a8;
  --accent: #8b6f47;
  --font-body: Georgia, 'Times New Roman', serif;
  --font-heading: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/styles/ public/styles/
git commit -m "feat: add global CSS and 4 built-in themes"
```

---

## Task 6: BaseLayout.astro

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```bash
mkdir -p src/layouts
```

```astro
---
import config from '../../timeliner.config';
import { resolveThemeHref } from '../utils/theme';
import '../styles/global.css';

interface Props {
  title?: string;
  lang?: string;
}

const { title = config.title, lang = config.lang.primary } = Astro.props;
const themeHref = resolveThemeHref(config.theme);
---
<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={config.description} />
    <link rel="stylesheet" href={themeHref} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout with theme loading"
```

---

## Task 7: Header.astro

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Create `src/components/Header.astro`**

```bash
mkdir -p src/components
```

```astro
---
interface Props {
  title: string;
  description: string;
  langSwitch?: { href: string; label: string };
}

const { title, description, langSwitch } = Astro.props;
---
<header class="site-header">
  <h1 class="site-title">{title}</h1>
  <p class="site-description">{description}</p>
  {langSwitch && (
    <nav class="lang-switch">
      <a href={langSwitch.href}>{langSwitch.label}</a>
    </nav>
  )}
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add Header component"
```

---

## Task 8: PhotoGrid.astro

**Files:**
- Create: `src/components/PhotoGrid.astro`

- [ ] **Step 1: Create `src/components/PhotoGrid.astro`**

```astro
---
interface Props {
  photos: string[];
}

const { photos } = Astro.props;
---
<div class="photo-grid">
  {photos.map(photo => (
    <a href={`/photos/${photo}`} target="_blank" rel="noopener noreferrer">
      <img
        src={`/photos-thumb/${photo}`}
        alt=""
        loading="lazy"
        onerror="this.closest('a').style.display='none'"
      />
    </a>
  ))}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PhotoGrid.astro
git commit -m "feat: add PhotoGrid component"
```

---

## Task 9: Entry.astro

**Files:**
- Create: `src/components/Entry.astro`

- [ ] **Step 1: Create `src/components/Entry.astro`**

```astro
---
import PhotoGrid from './PhotoGrid.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'days'>;
  isFirst: boolean;
  lang?: string;
}

const { entry, isFirst, lang = 'zh' } = Astro.props;
const { Content } = await entry.render();

const locale = lang === 'en' ? 'en-US' : 'zh-CN';
const dateStr = entry.data.date.toLocaleDateString(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---
<article class="entry">
  <div class="entry-node-col">
    <div class:list={['entry-node', { faded: !isFirst }]}></div>
    <div class="entry-connector"></div>
  </div>
  <div class="entry-body">
    <div class="entry-date">{dateStr}</div>
    <h2 class="entry-title">{entry.data.title}</h2>
    <div class="entry-content">
      <Content />
    </div>
    {entry.data.photos && entry.data.photos.length > 0 && (
      <PhotoGrid photos={entry.data.photos} />
    )}
  </div>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Entry.astro
git commit -m "feat: add Entry component"
```

---

## Task 10: Timeline.astro

**Files:**
- Create: `src/components/Timeline.astro`

- [ ] **Step 1: Create `src/components/Timeline.astro`**

```astro
---
import Entry from './Entry.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  entries: CollectionEntry<'days'>[];
  lang?: string;
}

const { entries, lang = 'zh' } = Astro.props;
---
<main class="timeline">
  {entries.map((entry, i) => (
    <Entry entry={entry} isFirst={i === 0} lang={lang} />
  ))}
</main>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Timeline.astro
git commit -m "feat: add Timeline component"
```

---

## Task 11: pages/index.astro

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```bash
mkdir -p src/pages
```

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Timeline from '../components/Timeline.astro';
import { getSortedEntries } from '../utils/content';
import config from '../../timeliner.config';

const entries = await getSortedEntries();
const secondaryLang = config.lang.secondary;
const langSwitch = secondaryLang
  ? { href: `/${secondaryLang}/`, label: secondaryLang.toUpperCase() }
  : undefined;
---
<BaseLayout>
  <Header
    title={config.title}
    description={config.description}
    langSwitch={langSwitch}
  />
  <Timeline entries={entries} lang={config.lang.primary} />
</BaseLayout>
```

- [ ] **Step 2: Run dev server to check it renders**

```bash
pnpm dev
```

Open `http://localhost:4321`. Expected: timeline with 3 sample entries, chalk theme (dark background, white text, vertical line with nodes).

Stop dev server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add primary language index page"
```

---

## Task 12: pages/en/index.astro

**Files:**
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Create `src/pages/en/index.astro`**

```bash
mkdir -p src/pages/en
```

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Timeline from '../../components/Timeline.astro';
import { getSortedEntries } from '../../utils/content';
import config from '../../../timeliner.config';

// If secondary language is disabled, redirect to primary page
if (!config.lang.secondary) {
  return Astro.redirect('/', 302);
}

const entries = await getSortedEntries();
const primaryLang = config.lang.primary;
---
<BaseLayout lang={config.lang.secondary as string}>
  <Header
    title={config.title}
    description={config.description}
    langSwitch={{ href: '/', label: primaryLang.toUpperCase() }}
  />
  <Timeline entries={entries} lang={config.lang.secondary as string} />
</BaseLayout>
```

- [ ] **Step 2: Verify bilingual works**

```bash
pnpm dev
```

Open `http://localhost:4321/en/`. Expected: same entries, dates in English format (e.g. "April 5, 2026"), language switcher shows "ZH".

Stop dev server.

- [ ] **Step 3: Verify disabling secondary language redirects**

In `timeliner.config.ts`, temporarily change `secondary: 'en'` to `secondary: false`.

```bash
pnpm dev
```

Open `http://localhost:4321/en/`. Expected: redirects to `/`.

Revert `timeliner.config.ts` back to `secondary: 'en'`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/en/index.astro
git commit -m "feat: add secondary language page with optional redirect"
```

---

## Task 13: gen-thumbs.sh + public directories

**Files:**
- Create: `scripts/gen-thumbs.sh`
- Create: `public/photos/.gitkeep`
- Create: `public/photos-thumb/.gitkeep`

- [ ] **Step 1: Create directory stubs**

```bash
mkdir -p scripts public/photos public/photos-thumb
touch public/photos/.gitkeep
```

Note: `public/photos-thumb/` is in `.gitignore`, so no `.gitkeep` needed there.

- [ ] **Step 2: Create `scripts/gen-thumbs.sh`**

```bash
#!/usr/bin/env bash
# Generate thumbnails from public/photos/ into public/photos-thumb/
# Usage: bash scripts/gen-thumbs.sh [width]
# Requires: ImageMagick — install with: brew install imagemagick

set -e

WIDTH=${1:-400}
SRC="public/photos"
DEST="public/photos-thumb"

if ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

find "$SRC" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r img; do
  rel="${img#"$SRC"/}"
  dest_file="$DEST/$rel"
  dest_dir="$(dirname "$dest_file")"
  mkdir -p "$dest_dir"
  if [ ! -f "$dest_file" ]; then
    echo "→ $dest_file"
    convert "$img" -resize "${WIDTH}>" "$dest_file"
  fi
done

echo "Done."
```

```bash
chmod +x scripts/gen-thumbs.sh
```

- [ ] **Step 3: Commit**

```bash
git add scripts/gen-thumbs.sh public/photos/.gitkeep
git commit -m "feat: add thumbnail generation script and public photo directories"
```

---

## Task 14: README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

````markdown
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
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with fork guide"
```

---

## Task 15: Full build verification

- [ ] **Step 1: Run tests**

```bash
pnpm test
```

Expected: all tests PASS, no failures.

- [ ] **Step 2: Build with chalk theme**

Ensure `timeliner.config.ts` has `theme: 'chalk'`. Then:

```bash
pnpm build
```

Expected: zero errors, `dist/` created.

- [ ] **Step 3: Preview and verify chalk theme**

```bash
pnpm preview
```

Open `http://localhost:4321`. Verify:
- Dark background, white text
- 3 entries with vertical timeline line and nodes
- Newest entry (2026-04-05) first
- Language switcher shows "EN" and `/en/` works with English dates

- [ ] **Step 4: Switch to ocean theme and rebuild**

In `timeliner.config.ts`, change `theme: 'chalk'` → `theme: 'ocean'`.

```bash
pnpm build && pnpm preview
```

Expected: deep blue background, sky-blue node on newest entry.

- [ ] **Step 5: Switch to neon theme**

Change `theme: 'ocean'` → `theme: 'neon'`.

```bash
pnpm build && pnpm preview
```

Expected: black background, pink node with glow, monospace font.

- [ ] **Step 6: Switch to parchment theme**

Change `theme: 'neon'` → `theme: 'parchment'`.

```bash
pnpm build && pnpm preview
```

Expected: warm off-white background, serif font, brown nodes.

- [ ] **Step 7: Restore chalk as default and final commit**

Change back to `theme: 'chalk'`.

```bash
pnpm build
git add timeliner.config.ts
git commit -m "chore: restore default chalk theme"
```

- [ ] **Step 8: Done**

All 4 themes verified. All tests pass. Build succeeds.
````
