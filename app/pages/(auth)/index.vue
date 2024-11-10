<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { type Schema, getInitialFormData, loginSchema } from "./_constants";

  definePageMeta({
    layout: "auth",
  });

  const colorMode = useColorMode();

  const state = ref(getInitialFormData());

  const isLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true;
    try {
      await $fetch("/api/auth/login", {
        method: "POST",
        body: event.data,
      });
      await navigateTo("/dashboard");
    } catch (error: any) {
      useToastError(String(error.statusCode), error.data.message);
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
          <NuxtImg
            v-if="colorMode.value === 'light'"
            src="/logo-dark.webp"
            width="150"
            alt="logo"
          />
          <NuxtImg v-else src="/logo-light.webp" width="150" alt="logo" />
          <div
            class="text-primary-500 dark:text-primary-400 text-2xl font-bold tracking-widest"
          >
            BERKAH

            <span class="text-black dark:text-white">AMANAH</span>
          </div>
        </div>
        <UForm
          :schema="loginSchema"
          :state="state"
          class="w-full space-y-6"
          :validate-on="['submit']"
          @submit="onSubmit"
        >
          <UFormGroup label="Username" name="username">
            <UInput
              v-model="state.username"
              :leading="true"
              placeholder="Masukkan nama pengguna"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              :leading="true"
              type="password"
              placeholder="Masukkan kata sandi"
            />
          </UFormGroup>

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
