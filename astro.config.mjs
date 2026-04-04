import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [tailwind(), mdx(), clerk()],
  adapter: node({ mode: 'standalone' }),
  output: 'server',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});

