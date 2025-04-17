<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { type Schema, getInitialFormData, loginSchema } from "./_constants";

  definePageMeta({
    layout: "auth",
  });

  const state = ref(getInitialFormData());

  const { execute, isLoading } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/auth/register",
      body: event.data,
      async onSuccess() {
        useToastSuccess(
          "Register Berhasil",
          "Silahkan login menggunakan akun anda"
        );
        await navigateTo("/");
      },
      onError(error) {
        useToastError("Register Gagal", error.data.message);
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
            class="text-(--ui-primary)-500 dark:text-(--ui-primary)-400 text-2xl font-bold tracking-widest"
          >
            BERKAH
            <span class="text-black dark:text-white">AMANAH</span>
          </div>
          <div class="mt-2 text-center">
            Sudah Punya Akun?
            <NuxtLink href="/" class="text-(--ui-primary)"> Login! </NuxtLink>
          </div>
        </div>
        <UForm
          :schema="loginSchema"
          :state="state"
          class="w-full space-y-6"
          @submit="onSubmit"
        >
          <UFormField label="Nama Lengkap" name="namaLengkap">
            <UInput
              v-model="state.namaLengkap"
              icon="i-heroicons-user"
              placeholder="Nama Lengkap"
            />
          </UFormField>
          <UFormField label="No Telepon" name="noTelepon">
            <UInput
              v-model="state.noTelepon"
              icon="i-heroicons-phone"
              placeholder="81XXX"
            />
          </UFormField>
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
              type="password"
              icon="i-heroicons-lock-closed"
              placeholder="Password"
            />
          </UFormField>

          <UButton
            class="flex w-full justify-center"
            type="submit"
            :loading="isLoading"
          >
            Daftar
          </UButton>
        </UForm>
      </div>
    </UCard>
  </main>
</template>
