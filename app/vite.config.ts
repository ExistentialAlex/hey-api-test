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
          postProcess: ['eslint'], // Lint the generated files
        },
        plugins: [
          {
            name: '@hey-api/typescript',
            enums: 'typescript-const',
            includeInEntry: true,
          },
          {
            name: 'zod',
            types: {
              infer: true,
            },
            includeInEntry: true,
          },
          {
            name: '@hey-api/client-ofetch',
            runtimeConfigPath: '@/core/hey-api.ts',
            throwOnError: true,
          },
          {
            name: '@hey-api/sdk',
          },
          {
            name: '@pinia/colada',
            queryKeys: true,
            includeInEntry: true,
          },
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
