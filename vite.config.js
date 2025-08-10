// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  appType: 'mpa',
  base: '/firegrade-samplesite/', // required for project pages
  build: { outDir: 'dist' }
});
