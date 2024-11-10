<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";
  import { json2Csv } from "~/utils";

  onMounted(() => {
    defineTopbarTitle("User");
  });

  const { data, status, refresh } = await useLazyFetch("/api/users");

  const state = ref(getInitialFormData());

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    modalLoading.value = true;
    try {
      await $fetch("/api/users", {
        method: "POST",
        body: event.data,
      });
      modalOpen.value = false;
      await refresh();
    } catch (error: any) {
      useToastError(String(error.statusCode), error.data.message);
    } finally {
      modalLoading.value = false;
    }
  }

  function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
  }

  const selected = ref<ExtractObjectType<typeof data.value>[]>([]);
  async function clickDelete() {
    async function onDelete() {
      const idArray = selected.value.map((item) => item.id);
      await $fetch("/api/users", {
        method: "DELETE",
        body: {
          id: idArray,
        },
      });
      if (selected.value) {
        selected.value = [];
      }
      await refresh();
    }

    openConfirmModal(onDelete);
  }

  async function clickUpdate(itemData: ExtractObjectType<typeof data.value>) {
    modalOpen.value = true;
    state.value.id = itemData.id;
    state.value.username = itemData.username;
    state.value.password = "";
    state.value.isActive = itemData.isActive;
  }
</script>

<template>
  <main>
    <Title>User</Title>
    <UModal v-model="modalOpen" prevent-close>
      <div class="px-4 py-5">
        <div class="mb-4 flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ state.id ? "Edit" : "Tambah" }} User
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1 rounded-full"
            :disabled="status === 'pending'"
            @click="modalOpen = false"
          />
        </div>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup label="Username" name="username">
            <UInput v-model="state.username" :disabled="modalLoading" />
          </UFormGroup>

          <UFormGroup v-if="!state.id" label="Password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              :disabled="modalLoading"
            />
          </UFormGroup>

          <UFormGroup label="Status" name="isActive">
            <UToggle v-model="state.isActive" :disabled="modalLoading" />
          </UFormGroup>

          <div class="flex w-full justify-end gap-2">
            <UButton
              icon="i-heroicons-x-mark-16-solid"
              variant="ghost"
              :disabled="modalLoading"
              @click="modalOpen = false"
            >
              Batal
            </UButton>
            <UButton
              type="submit"
              icon="i-heroicons-check-16-solid"
              :loading="modalLoading"
            >
              Simpan
            </UButton>
          </div>
        </UForm>
      </div>
    </UModal>
    <UCard
      :ui="{
        body: {
          padding: 'sm:p-8',
        },
      }"
    >
      <div
        class="mb-6 flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
      >
        <div class="flex gap-2">
          <UButton
            icon="i-heroicons-plus"
            variant="soft"
            class="gap-2 text-xs text-black md:text-base dark:text-white"
            @click="clickAdd"
          >
            Tambah
          </UButton>
          <UButton
            icon="i-heroicons-trash"
            variant="soft"
            class="gap-2 text-xs text-black disabled:opacity-50 md:text-base dark:text-white"
            :disabled="selected.length === 0"
            @click="clickDelete"
          >
            Hapus
          </UButton>
        </div>
        <UButton
          icon="i-heroicons-arrow-up-tray"
          variant="soft"
          class="gap-2 text-xs text-black disabled:opacity-50 md:text-base dark:text-white"
          :disabled="!(data && data.length > 0)"
          @click="json2Csv(data!)"
        >
          Ekspor
        </UButton>
      </div>
      <AppTable
        v-model="selected"
        label="Kelola User"
        :loading="status === 'pending'"
        :data="data"
        :columns="columns"
        @edit-click="(e) => clickUpdate(e)"
      >
        <template #isActive-data="{ row }">
          <div class="flex justify-center">
            <UBadge
              size="xs"
              :label="row.isActive ? 'Aktif' : 'Tidak Aktif'"
              :color="row.isActive ? 'emerald' : 'orange'"
              variant="solid"
              class="rounded-full"
            />
          </div>
        </template>
        <template #isActive-header="{ column }">
          <div class="text-center">{{ column.label }}</div>
        </template>
        <template #gender-data="{ row }">
          <div class="flex justify-center">
            <UBadge
              size="xs"
              :label="row.gender == 'laki' ? 'Laki - Laki' : 'Perempuan'"
              color="blue"
              variant="solid"
              class="rounded-full"
            />
          </div>
        </template>
        <template #gender-header="{ column }">
          <div class="text-center">{{ column.label }}</div>
        </template>
        <template #noTelepon-data="{ row }">
          <NuxtLink :href="`https://wa.me/${row.noTelepon}`" target="_blank">
            {{ row.noTelepon }}
          </NuxtLink>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
