import { combine } from '@antfu/eslint-config';
import { vueConfig } from 'hey-api-test-eslint-config';

const baseConfig = await vueConfig.override('antfu/vue/rules', {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          normal: 'never',
        },
      },
    ],
  },
});

export default combine(baseConfig, {
  rules: {
    'style/max-statements-per-line': ['off'],
    'ts/no-use-before-define': ['off'],
  },
  files: ['./src/client/**'],
});
