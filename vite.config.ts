/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solidPlugin({
      ssr: false,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    testTransformMode: {
      web: ['*.jsx', '*.tsx'],
    },
    setupFiles: './setupVitest.ts',
    // solid needs to be inline to work around
    // a resolution issue in vitest:
    deps: {
      inline: [/solid-js/],
    },
    // if you have few tests, try commenting one
    // or both out to improve performance:
    // threads: false,
    isolate: false,
  },
  build: {
    target: 'esnext',
    // polyfillDynamicImport: false,
  },
  resolve: {
    conditions: ['development', 'browser'],
  }
});
