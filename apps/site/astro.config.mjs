import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL ?? 'http://127.0.0.1:4321',
  base: process.env.SITE_BASE ?? '/fitness-guide',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'always',
});
