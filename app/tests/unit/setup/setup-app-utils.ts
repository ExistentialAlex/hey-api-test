import { vi } from 'vitest';
import { ref } from 'vue';

vi.mock('@/core', async () => {
  return {
    useConfig: vi.fn(() => ({
      config: ref({}),
    })),
  };
});
