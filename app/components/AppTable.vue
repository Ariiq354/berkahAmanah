<script setup lang="ts">
  import {
    getPaginationRowModel,
    type Row,
    type Table,
  } from "@tanstack/vue-table";
  import type { TableColumn, TableRow } from "@nuxt/ui";

  const UCheckbox = resolveComponent("UCheckbox");
  const table = useTemplateRef("table");

  const emit = defineEmits(["editClick"]);
  const {
    data,
    action = true,
    select = true,
    columns,
    searchQuery = "",
  } = defineProps<{
    data: any[] | undefined;
    columns: TableColumn<any>[];
    loading?: boolean;
    action?: boolean;
    select?: boolean;
    searchQuery?: string;
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

  const globalFilter = toRef(() => searchQuery);
  const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
  });
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
    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:global-filter="globalFilter"
      v-model:row-selection="rowSelection"
      :data="data"
      :columns="newColumns"
      :loading="loading"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
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

    <div class="flex justify-center pt-4">
      <UPagination
        :default-page="
          (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
        "
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="
          table?.tableApi?.getFilteredRowModel().rows.length! > 0
            ? table?.tableApi?.getFilteredRowModel().rows.length
            : data?.length
        "
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
