<script setup lang="ts">
  import type { NuxtError } from "#app";

  interface errorMessage {
    [id: string]: {
      name: string;
      message: string;
    };
  }

  defineProps<{
    error: NuxtError;
  }>();

  const statusMessage: errorMessage = {
    "404": {
      name: "Page not found",
      message:
        "Oops! We can’t seem to find the page you’re looking for. It might have been moved or deleted.",
    },
    "401": {
      name: "Unauthorized",
      message:
        "Oops! It looks like you need to log in to access this page. Please check your credentials and try again.",
    },
    "403": {
      name: "Forbidden",
      message:
        "Sorry, you don’t have permission to access this page. If you believe this is an error, please contact support.",
    },
    "500": {
      name: "Internal Server Error",
      message:
        "Uh-oh! Something went wrong on our end. We're working hard to fix it. Please try again later.",
    },
  };
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center">
    <h1 class="text-primary text-base font-semibold">
      {{ error?.statusCode }}
    </h1>
    <p
      class="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white"
    >
      {{ statusMessage[String(error?.statusCode)]?.name }}
    </p>
    <p
      class="mt-6 max-w-lg text-center text-base/7 text-gray-500 dark:text-gray-400"
    >
      {{ statusMessage[String(error?.statusCode)]?.message }}
    </p>

    <UButton
      to="/"
      size="lg"
      class="mt-10 flex items-center justify-center gap-x-6"
    >
      Go Back Home
    </UButton>
  </div>
</template>
