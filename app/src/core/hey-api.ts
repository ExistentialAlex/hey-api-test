import type { FetchHooks } from 'ofetch';
import type { Ref } from 'vue';
import type { CreateClientConfig } from '../client/client.gen';
import { useRouter } from 'vue-router';
import { useConfig } from './config';
import { i18n } from './i18n';

export const createClientConfig: CreateClientConfig = (config) => {
  const { config: appConfig } = useConfig();
  const url = appConfig.value?.VITE_API_BASE_URL || '/';

  const router = useRouter();
  const toast = useToast();

  const unauthorisedErrorHook: FetchHooks['onResponseError'] = ({ response }) => {
    if (response.status !== 401) {
      return;
    }

    toast.add({
      title: i18n.global.t('app.composables.useFetch.toasts.unauthorised.title'),
      description: i18n.global.t('app.composables.useFetch.toasts.unauthorised.description'),
    });
    router.push('/login');
  };

  const setLocale: FetchHooks['onRequest'] = ({ options }) => {
    options.headers.set('accept-language', (i18n.global.locale as unknown as Ref<string>).value);
  };

  return {
    ...config,
    baseUrl: url,
    credentials: 'include',
    onRequest: [setLocale],
    onResponseError: [unauthorisedErrorHook],
  };
};
