import type { FetchError } from 'ofetch';
import { useMutation, useQueryCache } from '@pinia/colada';
import { useI18n } from 'vue-i18n';
import { deleteUsersIdMutation, getPaginatedUsersQueryKey, getUsersByIdQueryKey } from '@/client/@pinia/colada.gen';

export const useDeleteUser = () => {
  const toast = useToast();
  const { t } = useI18n();
  const queryCache = useQueryCache();

  return useMutation({
    ...deleteUsersIdMutation(),
    onSuccess: async ({ id }) => {
      toast.add({
        title: t('app.composables.users.useDeleteUser.toasts.onSuccess.title'),
        description: t('app.composables.users.useDeleteUser.toasts.onSuccess.description', {
          id,
        }),
        color: 'success',
      });
    },
    onError: (error) => {
      toast.add({
        title: t('app.composables.users.useDeleteUser.toasts.onError.title'),
        description: (error as FetchError).data,
        color: 'error',
      });
    },
    onSettled: (_, __, { path }) => {
      queryCache.invalidateQueries({ key: getUsersByIdQueryKey({ path }), exact: true }); // Invalidate edit page query
      queryCache.invalidateQueries({ key: getPaginatedUsersQueryKey(), exact: true }); // Invalidate list view query
    },
  });
};
