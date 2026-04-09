import { combine, ignores } from '@antfu/eslint-config';
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

export default combine(baseConfig, ignores(['./src/client/**']));
