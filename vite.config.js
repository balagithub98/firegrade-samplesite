import { defineConfig } from 'vite';
export default defineConfig({
  appType: 'mpa',
  base: '/firegrade-samplesite/',   // <- update if the repo name changes
  build: { outDir: 'dist' }
});
