import type { MaybeRefOrGetter } from 'vue';
import type { RouteParamValueRaw } from 'vue-router';
import { watchDebounced } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { ref } from 'vue';

type RouteQueryValueRaw = RouteParamValueRaw | string[];

type UseDebouncedRouteQueryOptions<T extends RouteQueryValueRaw = RouteQueryValueRaw, K = T> = Parameters<typeof useRouteQuery<T, K>>['2'] & { debounce?: number };

export const useDebouncedRouteQuery = <T extends RouteQueryValueRaw = RouteQueryValueRaw, K = T>(
  key: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options?: UseDebouncedRouteQueryOptions<T, K>,
) => {
  const routeQuery = useRouteQuery<T, K>(key, defaultValue, options);
  const input = ref(routeQuery.value);

  watchDebounced(
    input,
    (val) => {
      routeQuery.value = val;
    },
    {
      debounce: options?.debounce || 500,
    },
  );

  return input;
};
