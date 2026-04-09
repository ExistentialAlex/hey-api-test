import path from 'node:path';

import { fileURLToPath, URL } from 'node:url';
import { heyApiPlugin } from '@hey-api/vite-plugin';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import ui from '@nuxt/ui/vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import Layouts from 'vite-plugin-vue-layouts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    heyApiPlugin({
      config: {
        input: '../server/openapi.json',
        output: {
          path: 'src/client',
        },
        plugins: [
          '@hey-api/typescript',
          {
            name: '@hey-api/sdk',
            client: '@hey-api/client-ofetch',
            validator: true,
          },
          'zod',
          {
            name: '@hey-api/client-ofetch',
            runtimeConfigPath: '@/core/hey-api.ts',
          },
          '@pinia/colada',
        ],
      },
    }),
    VueRouter(),
    vue(),
    vueDevTools(),
    Layouts(),
    ui({
      ui: {
        colors: {
          neutral: 'zinc',
        },
      },
      colorMode: false,
    }),
    VueI18nPlugin({
      include: [path.resolve(__dirname, '../shared/i18n/src/locales/**')],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
