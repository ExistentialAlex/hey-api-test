import type { DefineQueryOptionsTagged, UseQueryOptions } from '@pinia/colada';
import type { PaginationResponse } from 'hey-api-test-schemas';
import type { ColumnSort } from 'hey-api-test-types';
import type { Ref } from 'vue';
import { useQuery } from '@pinia/colada';
import { useRouteQuery } from '@vueuse/router';
import {
  convertQuerySortToColumnSort,
  convertSortToQuerySort,
} from 'hey-api-test-utils';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { updatePaginatedUrls } from '@/utils';
import { useDebouncedRouteQuery } from './useDebouncedRouteQuery.composable';

const defaultPageSize = 25;
const defaultSearch = '';
const defaultSort: string[] = [];

/**
 * A composable for handling paginated data with query parameter management.
 *
 * @template T The type of items in the paginated result
 *
 * @param definedQuery The Pinia Colada Query to Execute
 * @param options Additional query options
 *
 * @returns Object containing pagination state, controls, and query results
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { pageSize, search, sort, useQueryParam } = usePagination(['users'], '/api/users');
 *
 * // Create refs for additional query params
 * const status = useQueryParam('status');
 * const attributeType = useQueryParam('attribute_type');
 *
 * // Use with v-model
 * // <UInput v-model="search" />
 * // <USelectMenu v-model="status" />
 * ```
 */

export const usePagination = <T>(
  definedQuery: DefineQueryOptionsTagged<PaginationResponse<T>>,
  options: Partial<UseQueryOptions<PaginationResponse<T>>> = {},
) => {
  const route = useRoute();

  const search: Ref<string> = useDebouncedRouteQuery('search', defaultSearch, { debounce: 500, mode: 'push' });
  const sort: Ref<ColumnSort[]> = useRouteQuery('sort', defaultSort as string[], {
    transform: {
      get: (v) => convertQuerySortToColumnSort(v),
      set: (v) => convertSortToQuerySort(v),
    },
    mode: 'push',
  });
  const pageSize: Ref<number> = useRouteQuery('page_size', defaultPageSize, { transform: Number, mode: 'push' });
  const pageSizeItems = [5, 10, 25, 50, 100];

  const query = useQuery<PaginationResponse<T>>({
    ...definedQuery,
    query: (context) => definedQuery.query({
      ...context,
      query: route.query,
    } as any).then(updatePaginatedUrls),
    ...options,
  });

  watch(
    () => route.query,
    () => {
      query.refetch(); // Manually refetch based on changes to the route query.
    },
    { deep: true },
  );

  return {
    ...query,
    search,
    sort,
    pageSize,
    pageSizeItems,
  };
};
