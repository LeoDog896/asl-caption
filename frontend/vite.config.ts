import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import Unfonts from 'unplugin-fonts/vite';

export default defineConfig({
  plugins: [
    sveltekit(),

    Unfonts({
      custom: {
        families: {
          Inter: {
            src: './src/assets/fonts/inter/Inter*',
            local: 'Inter'
          },
          'Inter var': {
            src: './src/assets/fonts/inter/var/Inter*',
            local: 'Inter',

            transform(font) {
              // @ts-ignore Incorrect typings?
              // Required for variable fonts to work.
              // I checked the source of the plugin and this valid.
              font.weight = '100 900';
              return font;
            }
          }
        },

        display: 'swap'
      }
    })
  ]
});
