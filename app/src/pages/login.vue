<script setup lang="ts">
import type { Auth } from 'hey-api-test-schemas';
import { useMutation } from '@pinia/colada';
import { AuthSchema } from 'hey-api-test-schemas';
import { definePage } from 'unplugin-vue-router/runtime';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { postAuthLoginMutation } from '@/client/@pinia/colada.gen';
import { useUserSession } from '@/composables';

definePage({
  name: 'login',
  meta: {
    title: 'app.pages.login.title',
    requiresAuth: false,
    layout: 'none',
  },
});

const { fetch: refreshSession } = useUserSession();

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();

const credentials = reactive<Auth>({
  email: '',
  organisation: '',
});
const organisations = ref([
  'Organisation A',
  'Organisation B',
  'Test Organisation A',
  'Test Organisation B',
]);

const { mutateAsync: authLogin } = useMutation({
  ...postAuthLoginMutation(),
  onError: (err) =>
    toast.add({
      title: t('app.pages.login.toasts.login.error'),
      description: err.message,
      color: 'error',
    }),
});

const login = async () => {
  await authLogin({ body: credentials });
  await refreshSession();
  router.push((route.query.redirect as string) || '/');
};
</script>

<template>
  <div class="grid h-screen place-items-center">
    <UCard>
      <template #header>
        <h1 class="text-center text-lg">
          {{ t('app.pages.login.header') }}
        </h1>
      </template>
      <UForm class="flex flex-col gap-4" :schema="AuthSchema" :state="credentials" @submit="login">
        <UFormField :label="t('app.pages.login.form.email.label')" name="email" required>
          <UInput
            v-model="credentials.email" class="w-full" :placeholder="t('app.pages.login.form.email.placeholder')"
            data-testid="login-form:email"
          />
        </UFormField>
        <UFormField :label="t('app.pages.login.form.organisation.label')" name="organisation" required class="flex-1">
          <USelect
            v-model="credentials.organisation" :items="organisations" class="w-full"
            :placeholder="t('app.pages.login.form.organisation.placeholder')" data-testid="login-form:organisation"
          />
        </UFormField>
        <USeparator />
        <UButton icon="i-lucide-log-in" class="mx-auto" data-testid="login-form:submit" type="submit">
          {{ t('app.pages.login.form.submit') }}
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped></style>
