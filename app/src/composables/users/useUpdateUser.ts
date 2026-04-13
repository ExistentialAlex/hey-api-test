import type { FetchError } from 'ofetch';
import { useMutation, useQueryCache } from '@pinia/colada';
import { useI18n } from 'vue-i18n';
import { getPaginatedUsersQueryKey, getUsersByIdQueryKey, patchUsersIdMutation } from '@/client';

export const useUpdateUser = () => {
  const toast = useToast();
  const { t } = useI18n();
  const queryCache = useQueryCache();

  return useMutation({
    ...patchUsersIdMutation(),
    onSuccess: async (res) => {
      toast.add({
        title: t('app.composables.users.useUpdateUser.toasts.onSuccess.title'),
        description: t('app.composables.users.useUpdateUser.toasts.onSuccess.description', {
          name: res.name,
        }),
        color: 'success',
      });
    },
    onError: (error) => {
      toast.add({
        title: t('app.composables.users.useUpdateUser.toasts.onError.title'),
        description: (error as FetchError).data,
        color: 'error',
      });
    },
    onSettled: (_, __, { path }) => {
      queryCache.invalidateQueries({ key: getUsersByIdQueryKey({ path }), exact: true }); // Invalidate edit page query
      queryCache.invalidateQueries({ key: getPaginatedUsersQueryKey() }); // Invalidate list view query
    },
  });
};
