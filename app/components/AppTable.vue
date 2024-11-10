<script setup lang="ts">
  type ColumnType = {
    key: string;
    label: string;
    sortable?: boolean;
  };

  type DataItem = { [key: string]: any };

  const { data, columns, label, loading } = defineProps<{
    data: DataItem[] | undefined;
    columns: ColumnType[];
    label?: string;
    loading?: boolean;
    selectable?: boolean;
  }>();

  const emit = defineEmits(["editClick"]);

  const numberedColumn = computed(() => {
    return [
      {
        key: "rownumber",
        label: "No.",
        sortable: true,
      },
      ...columns,
      {
        key: "actions",
        label: "Aksi",
      },
    ];
  });

  const numberedData = computed((): DataItem[] => {
    if (data) {
      return data.map((item, index) => ({
        rownumber: index + 1,
        ...item,
      }));
    }

    return [];
  });

  const sortRef = ref<{
    column: string;
    direction: "asc" | "desc";
  }>();

  const sortedData = computed(() => {
    if (!sortRef.value) {
      return numberedData.value;
    }
    const sortColumn = sortRef.value.column;
    const sortDirection = sortRef.value.direction;

    return [...numberedData.value].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (sortDirection === "desc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  });

  const query = ref("");

  const filteredRows = computed(() => {
    if (!query.value) {
      return sortedData.value;
    }

    return sortedData.value.filter((person) => {
      return Object.values(person).some((value) => {
        return String(value).toLowerCase().includes(query.value.toLowerCase());
      });
    });
  });

  const page = ref(1);
  const pageCount = 10;

  const pagedRows = computed(() => {
    return filteredRows.value?.slice(
      (page.value - 1) * pageCount,
      page.value * pageCount
    );
  });

  const selected = defineModel<DataItem[]>();

  function select(row: (typeof pagedRows.value)[number]) {
    if (selected.value) {
      const index = selected.value?.findIndex(
        (item) => item.rownumber === row.rownumber
      );
      if (index === -1) {
        selected.value?.push(row);
      } else {
        selected.value?.splice(index, 1);
      }
    }
  }
  function removeRowNumber(obj: (typeof numberedData.value)[number]) {
    const { rownumber, ...rest } = obj;
    return rest;
  }
</script>

<template>
  <div>
    <div
      class="flex flex-col justify-between gap-2 border-b border-gray-200 px-4 py-3 md:flex-row md:items-center dark:border-gray-700"
    >
      <h1>{{ label }}</h1>
      <UInput
        v-model="query"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search..."
      />
    </div>
    <UTable
      v-model="selected"
      v-model:sort="sortRef"
      :rows="pagedRows"
      :columns="numberedColumn"
      :loading="loading"
      sort-mode="manual"
      @select="select"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
      <template #actions-data="{ row }">
        <div class="flex justify-center">
          <UButton
            icon="i-heroicons-pencil-16-solid"
            size="2xs"
            variant="outline"
            :ui="{ rounded: 'rounded-full' }"
            square
            aria-label="Edit item"
            @click.stop="emit('editClick', removeRowNumber(row))"
          />
        </div>
      </template>
      <template #actions-header="{ column }">
        <div class="text-center">{{ column.label }}</div>
      </template>
    </UTable>
    <div class="overflow-x-auto">
      <slot name="additional-content" />
    </div>
    <div class="flex justify-end px-3 py-3.5">
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="data ? data.length : 0"
      />
    </div>
  </div>
</template>
