import { defineConfig, fontProviders } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import clerk from '@clerk/astro';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://philosophyspread.live',
  integrations: [tailwind(), mdx(), clerk()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
  adapter: cloudflare(),
  output: 'server',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
