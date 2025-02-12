<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { type Schema, getInitialFormData, loginSchema } from "./_constants";

  definePageMeta({
    layout: "auth",
  });

  const state = ref(getInitialFormData());

  const isLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true;
    try {
      await $fetch("/api/auth/register", {
        method: "POST",
        body: event.data,
      });
      useToastSuccess(
        "Register Berhasil",
        "Silahkan login menggunakan akun anda"
      );
      await navigateTo("/");
    } catch (error: any) {
      useToastError("Register Gagal", error.data.message);
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <main class="flex w-full items-center justify-center">
    <Title>Login</Title>
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
            Sudah Punya Akun?
            <NuxtLink href="/" class="text-primary"> Login! </NuxtLink>
          </div>
        </div>
        <UForm
          :schema="loginSchema"
          :state="state"
          class="w-full space-y-6"
          :validate-on="['submit']"
          @submit="onSubmit"
        >
          <UFormGroup label="Nama Lengkap" name="namaLengkap">
            <UInput
              v-model="state.namaLengkap"
              icon="i-heroicons-user"
              placeholder="Nama Lengkap"
            />
          </UFormGroup>
          <UFormGroup label="No Telepon" name="noTelepon">
            <UInput
              v-model="state.noTelepon"
              icon="i-heroicons-phone"
              placeholder="81XXX"
            />
          </UFormGroup>
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="state.email"
              icon="i-heroicons-envelope"
              placeholder="Email"
            />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              icon="i-heroicons-lock-closed"
              placeholder="Password"
            />
          </UFormGroup>

          <UButton
            class="flex w-full justify-center rounded-full"
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
