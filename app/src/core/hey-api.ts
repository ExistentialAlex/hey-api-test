import type { FetchHooks } from 'ofetch';
import type { CreateClientConfig } from '../client/client.gen';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useConfig } from './config';

export const createClientConfig: CreateClientConfig = (config) => {
  const { config: appConfig } = useConfig();
  const url = appConfig.value?.VITE_API_BASE_URL || '/';

  const router = useRouter();
  const toast = useToast();
  const { t, locale } = useI18n();

  const unauthorisedErrorHook: FetchHooks['onResponseError'] = ({ response }) => {
    if (response.status !== 401) {
      return;
    }

    toast.add({
      title: t('app.composables.useFetch.toasts.unauthorised.title'),
      description: t('app.composables.useFetch.toasts.unauthorised.description'),
    });
    router.push('/login');
  };

  const setLocale: FetchHooks['onRequest'] = ({ options }) => {
    options.headers.set('accept-language', locale.value);
  };

  return {
    ...config,
    baseUrl: url,
    credentials: 'include',
    onRequest: [setLocale],
    onResponseError: [unauthorisedErrorHook],
  };
};
