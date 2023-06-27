import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';
import dsv from '@rollup/plugin-dsv';

export default defineConfig({
  plugins: [sveltekit(), ViteYaml(), dsv()]
});
