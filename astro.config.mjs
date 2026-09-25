import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://rsk-garant.ru',
  output: 'static',
  adapter: node({
    mode: 'standalone'
  }),
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});