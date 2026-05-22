import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      'astro:content': path.resolve(__dirname, './test/mocks/astro-content.ts'),
    },
  },
});
