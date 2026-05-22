const BUILTIN_THEMES = ['chalk', 'ocean', 'neon', 'parchment'] as const;

export function resolveThemeHref(theme: string): string {
  if ((BUILTIN_THEMES as readonly string[]).includes(theme)) {
    return `/styles/themes/${theme}.css`;
  }
  return theme;
}
