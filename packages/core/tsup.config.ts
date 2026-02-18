import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,  // Disable tsup's DTS, we'll use tsc
  sourcemap: true,
  clean: true,
  treeshake: true,
});
