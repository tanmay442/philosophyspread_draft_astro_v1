import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [tailwind(), mdx(), clerk()],
  adapter: cloudflare({
    configPath: './wrangler.jsonc',
    prerenderEnvironment: 'node',
  }),
  output: 'server',
  vite: {
    ssr: {
      external: [
        'node:async_hooks', 
        'node:fs', 
        'node:path', 
        'node:crypto', 
        'node:os', 
        'node:stream', 
        'node:buffer',
        'async_hooks', 
        'fs', 
        'path', 
        'crypto', 
        'os', 
        'stream', 
        'buffer'
      ],
    },
  },
});