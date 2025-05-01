<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { type Schema, getInitialFormData, loginSchema } from "./_constants";

  definePageMeta({
    layout: "auth",
  });

  const config = useRuntimeConfig();

  const state = ref(getInitialFormData());

  const { execute, isLoading } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: `${config.public.apiBase}/auth/login`,
      body: event.data,
      async onSuccess() {
        await navigateTo("/dashboard");
      },
      onError(error) {
        useToastError("Login Gagal", error.data.message);
      },
    });
  }
</script>

<template>
  <Title>Login</Title>
  <main class="flex w-full items-center justify-center">
    <UCard class="w-full max-w-md">
      <div class="space-y-6">
        <div class="flex flex-col items-center text-center">
          <NuxtImg src="/logo.webp" width="130" alt="logo" class="m-8" />
          <div
            class="text-primary-500 dark:text-primary-400 text-2xl font-bold tracking-widest"
          >
            BERKAH
            <span class="text-black dark:text-white">AMANAH</span>
          </div>
          <div class="mt-2 text-center">
            Belum Punya Akun?
            <NuxtLink href="/register" class="text-(--ui-primary)">
              Daftar Sekarang!
            </NuxtLink>
          </div>
        </div>
        <UForm
          :schema="loginSchema"
          :state="state"
          class="w-full space-y-6"
          @submit="onSubmit"
        >
          <UFormField label="Email" name="email">
            <UInput
              v-model="state.email"
              icon="i-heroicons-envelope"
              placeholder="Email"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="state.password"
              icon="i-heroicons-lock-closed"
              type="password"
              placeholder="Password"
            />
          </UFormField>

          <UCheckbox v-model="state.rememberMe" label="Ingat saya" />

          <UButton
            class="flex w-full justify-center"
            type="submit"
            :loading="isLoading"
          >
            Lanjut
          </UButton>
        </UForm>
      </div>
    </UCard>
  </main>
</template>
