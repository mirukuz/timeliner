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
