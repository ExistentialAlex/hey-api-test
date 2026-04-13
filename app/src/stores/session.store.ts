import type { GetSessionResponse } from '@/client';
import { useQuery } from '@pinia/colada';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { deleteSession, getSessionQuery } from '@/client';

/**
 * Composable to get back the user session and utils around it.
 */
export const useSessionStore = defineStore('session', () => {
  const sessionState = ref<GetSessionResponse | null>(null);
  const authReadyState = ref(false);

  const { refetch } = useQuery({
    ...getSessionQuery({
      headers: {
        accept: 'application/json',
      },
      retry: false,
    }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const clear = async () => {
    await deleteSession();
    sessionState.value = null;
  };

  const fetch = async () => {
    sessionState.value = await refetch().then((res) => res.data || null).catch(() => null);

    if (!authReadyState.value) {
      authReadyState.value = true;
    }
  };

  return {
    authReadyState,
    sessionState,
    fetch,
    clear,
  };
});
