import { defineConfig } from 'vite';

// Set this to "/<repository-name>/" when using project pages like
// https://<username>.github.io/<repository-name>/
const repo = process.env.VITE_REPO_BASE || '/bala-sample-site/';

export default defineConfig({
  appType: 'mpa',     // Multi-Page Application (MPA) [multiple standalone HTML pages]
  base: repo,
  build: { outDir: 'dist' }
});
