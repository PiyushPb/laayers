import { defineConfig } from 'vitest/config';
import SummaryReporter from './tests/reporters/summary-reporter';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    reporters: ['default', './tests/reporters/summary-reporter.ts'],
    // Show tests progress in console
    ui: false,
    server: {
      deps: {
        inline: [/@layers\/.*/],
      },
    },
  },
});
