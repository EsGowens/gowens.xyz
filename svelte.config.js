import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Essential for Svelte 5 and Tailwind v4 compilation
  preprocess: vitePreprocess(),

  kit: {
    // Adapter-cloudflare will read your project routes and map them perfectly to Cloudflare's CDN
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    })
  }
};

export default config;