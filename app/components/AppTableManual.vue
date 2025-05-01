<script setup lang="ts">
  import type { TableColumn, TableRow } from "@nuxt/ui";
  import type { Row, Table } from "@tanstack/vue-table";

  const UCheckbox = resolveComponent("UCheckbox");
  const table = useTemplateRef("table");

  const emit = defineEmits(["editClick", "pageChange"]);
  const {
    data,
    action = true,
    select = true,
    columns,
  } = defineProps<{
    data: any[] | undefined;
    columns: TableColumn<any>[];
    total: number;
    loading?: boolean;
    action?: boolean;
    select?: boolean;
  }>();
  defineSlots<{
    [key: string]: (props: any) => any;
  }>();

  const newColumns = computed(() => {
    return [
      ...(select
        ? [
            {
              id: "select",
              header: ({ table }: { table: Table<any> }) =>
                h(UCheckbox, {
                  modelValue: table.getIsSomePageRowsSelected()
                    ? "indeterminate"
                    : table.getIsAllPageRowsSelected(),
                  "onUpdate:modelValue": (value: boolean | "indeterminate") =>
                    table.toggleAllPageRowsSelected(!!value),
                  ariaLabel: "Select all",
                }),
              cell: ({ row }: { row: Row<any> }) =>
                h(UCheckbox, {
                  modelValue: row.getIsSelected(),
                  "onUpdate:modelValue": (value: boolean | "indeterminate") =>
                    row.toggleSelected(!!value),
                  ariaLabel: "Select row",
                }),
            },
          ]
        : []),
      {
        header: "No.",
        cell: (info: any) => info.row.index + 1,
      },
      ...columns,
      ...(action
        ? [
            {
              header: "Aksi",
              accessorKey: "actions",
            },
          ]
        : []),
    ];
  });

  const globalFilter = ref("");
  const selectedRow = defineModel<unknown[]>();
  const rowSelection = ref<Record<string, boolean>>({});

  watch([rowSelection], async () => {
    await nextTick();
    selectedRow.value = table.value?.tableApi
      .getSelectedRowModel()
      .rows.map((row) => row.original);
  });

  function onSelect(row: TableRow<any>) {
    row.toggleSelected(!row.getIsSelected());
  }
  const handleSelect = select ? onSelect : undefined;
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <div class="flex w-full flex-1 flex-col">
      <div
        class="flex justify-end border-b border-(--ui-border-accented) py-3.5"
      >
        <UInput
          v-model="globalFilter"
          class="max-w-xs"
          leading-icon="i-heroicons-magnifying-glass"
          placeholder="Filter..."
        />
      </div>

      <UTable
        ref="table"
        v-model:global-filter="globalFilter"
        v-model:row-selection="rowSelection"
        :data="data"
        :columns="newColumns"
        :loading="loading"
        @select="handleSelect"
      >
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
          <slot :name="name" v-bind="slotData ?? {}" />
        </template>
        <template #actions-header="{ column }">
          <div class="text-center">{{ column.columnDef.header }}</div>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex justify-center">
            <UButton
              icon="i-heroicons-pencil-16-solid"
              size="xs"
              variant="outline"
              :ui="{ base: 'rounded-full' }"
              square
              aria-label="Edit item"
              @click="emit('editClick', row.original)"
            />
          </div>
        </template>
      </UTable>
    </div>

    <div class="flex justify-center pt-4">
      <UPagination
        :items-per-page="10"
        :total="total"
        @update:page="(p: number) => emit('pageChange', p)"
      />
    </div>
  </div>
</template>
