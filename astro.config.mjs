import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [tailwind(), mdx(), clerk()],
  adapter: cloudflare(),
  output: 'server',
});