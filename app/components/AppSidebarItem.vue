<script setup lang="ts">
  type itemProp = {
    label: string;
    icon?: string;
    link?: string;
    children?: itemProp[];
  };

  const route = useRoute();

  const props = defineProps<{
    linkItemProp: itemProp[];
    depth: number;
  }>();

  const linkItemAlone = computed(() => {
    return props.linkItemProp.filter((item) => !item.children);
  });

  const linkItemAccordion = computed(() => {
    return props.linkItemProp.filter((item) => item.children);
  });

  const sidebarState = useSidebarToggle();

  const tabPadding = computed(() => {
    if (props.depth > 0) {
      return {
        paddingLeft: `${1.75 * props.depth}rem`,
      };
    } else {
      return {};
    }
  });
</script>

<template>
  <div v-for="(aloneItem, aloneIndex) in linkItemAlone" :key="aloneIndex">
    <NuxtLink
      class="flex w-full items-center gap-2 px-8 py-3 text-base transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      :to="aloneItem.link"
      @click="sidebarState = true"
    >
      <UIcon
        v-if="depth === 0"
        :name="aloneItem.icon ? aloneItem.icon : ''"
        class="text-primary h-5 w-5"
      />
      <p
        :class="{
          'font-bold': route.fullPath === aloneItem.link,
          'text-sm': depth > 0,
        }"
        class="text-black dark:text-white"
        :style="tabPadding"
      >
        {{ aloneItem.label }}
      </p>
    </NuxtLink>
  </div>
  <UAccordion
    class="text-black dark:text-white"
    :ui="{
      item: {
        padding: 'pt-0 pb-0',
      },
    }"
    :items="linkItemAccordion"
  >
    <template #default="{ item, open }">
      <div
        class="flex w-full items-center gap-2 px-8 py-3 text-base transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <UIcon
          v-if="depth === 0"
          :name="item.icon ? item.icon : ''"
          class="text-primary h-5 w-5"
        />
        <span
          class="truncate"
          :class="{ 'text-sm': depth > 0 }"
          :style="tabPadding"
        >
          {{ item.label }}
        </span>
        <UIcon
          name="i-heroicons-chevron-right-20-solid"
          class="ms-auto h-5 w-5 transform transition-transform duration-200"
          :class="[open && 'rotate-90']"
        />
      </div>
    </template>
    <template #item="{ item }">
      <AppSidebarItem :link-item-prop="item.children" :depth="depth + 1" />
    </template>
  </UAccordion>
</template>
