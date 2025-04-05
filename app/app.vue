<script setup lang="ts">
  useHead({
    htmlAttrs: {
      lang: "id",
    },
    link: [
      {
        rel: "icon",
        type: "image/ico",
        href: "/favicon.ico",
      },
    ],
  });
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-black">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator :height="5" />
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>

<style>
  html {
    font-family: Poppins, sans-serif;
    font-size: 14px;
  }
</style>
