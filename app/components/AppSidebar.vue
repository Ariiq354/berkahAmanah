<script setup lang="ts">
  import type { NavigationMenuItem } from "@nuxt/ui";
  import { hasPermission } from "~~/shared/role";

  const sidebarState = useSidebarToggle();
  const user = useUser();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const sidebarItems: NavigationMenuItem[] | NavigationMenuItem[][] = [
    [
      {
        label: "Dashboard",
        type: "label",
      },
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: "i-heroicons-home",
      },
    ],
    [
      {
        label: "User",
        type: "label",
      },
      {
        label: "Shu",
        icon: "i-heroicons-archive-box",
      },
      {
        label: "Simpanan",
        icon: "i-heroicons-briefcase",
        children: [
          {
            label: "Setoran",
            to: "/dashboard/simpanan-setoran",
          },
          {
            label: "Penarikan",
            to: "/dashboard/simpanan-penarikan",
          },
          {
            label: "Pemindahbukuan",
            to: "/dashboard/simpanan-pemindahbukuan",
          },
          {
            label: "Monitoring",
            to: "/dashboard/simpanan-monitoring",
          },
        ],
      },
      {
        label: "Pembiayaan",
        icon: "i-heroicons-banknotes",
        children: [
          {
            label: "Murabahah",
            to: "/dashboard/pembiayaan-murabahah",
          },
          {
            label: "Angsuran",
            to: "/dashboard/pembiayaan-angsuran",
          },
          {
            label: "Monitoring",
            to: "/dashboard/pembiayaan-monitoring",
          },
        ],
      },
    ],
    hasPermission(user.value!, "role:admin")
      ? ([
          {
            label: "Admin",
            type: "label",
          },
          {
            label: "Nilai Saham",
            to: "/dashboard/saham",
            icon: "i-heroicons-chart-bar-square",
          },
          {
            label: "Nilai Athar",
            to: "/dashboard/athar",
            icon: "i-heroicons-chart-bar-square",
          },
          {
            label: "Persetujuan",
            icon: "i-heroicons-clipboard-document-check",
            children: [
              {
                label: "Setoran",
                to: "/dashboard/persetujuan-setoran",
              },
              {
                label: "Penarikan",
                to: "/dashboard/persetujuan-penarikan",
              },
              {
                label: "Pemindahbukuan",
                to: "/dashboard/persetujuan-pemindahbukuan",
              },
              {
                label: "Murabahah",
                to: "/dashboard/persetujuan-murabahah",
              },
              {
                label: "Setoran Angsuran",
                to: "/dashboard/persetujuan-angsuran",
              },
              {
                label: "Anggota",
                to: "/dashboard/persetujuan-anggota",
              },
            ],
          },
          {
            label: "Distributor Athar",
            icon: "i-heroicons-truck",
            children: [
              {
                label: "Pembelian",
                to: "/dashboard/athar-pembelian",
              },
              {
                label: "Penjualan",
                to: "/dashboard/athar-penjualan",
              },
              {
                label: "Pembayaran Hutang",
                to: "/dashboard/athar-pembayaran-hutang",
              },
              {
                label: "Pembayaran",
                to: "/dashboard/athar-pembayaran",
              },
              {
                label: "Monitoring",
                to: "/dashboard/athar-monitoring",
              },
            ],
          },
          {
            label: "Monitoring",
            icon: "i-heroicons-presentation-chart-line",
            children: [
              {
                label: "Simpanan",
                to: "/dashboard/monitoring-simpanan",
              },
              {
                label: "Pembiayaan",
                to: "/dashboard/monitoring-pembiayaan",
              },
              {
                label: "SHU",
              },
              {
                label: "Anggota",
                to: "/dashboard/monitoring-anggota",
              },
            ],
          },
          {
            label: "Transaksi",
            icon: "i-heroicons-calculator",
            children: [
              {
                label: "Daftar Akun",
                to: "/dashboard/transaksi-akun",
              },
              {
                label: "Daftar Transaksi",
                to: "/dashboard/transaksi-transaksi",
              },
              {
                label: "Input Transaksi",
                to: "/dashboard/transaksi-input",
              },
              {
                label: "Generate SHU",
              },
              {
                label: "Input Fee Management",
                to: "/dashboard/transaksi-fee",
              },
            ],
          },
          {
            label: "Laporan Keuangan",
            icon: "i-heroicons-scale",
            children: [
              {
                label: "Neraca",
                to: "/dashboard/keuangan-neraca",
              },
              {
                label: "Laba Rugi",
                to: "/dashboard/keuangan-labarugi",
              },
              {
                label: "Posting",
              },
            ],
          },
        ] as NavigationMenuItem[])
      : [],
  ];
</script>

<template>
  <aside
    class="fixed top-0 z-20 hidden h-full w-72 overflow-auto border-r border-gray-200 bg-white shadow-xl transition-all duration-200 md:block dark:border-gray-700 dark:bg-gray-900"
    :class="sidebarState ? '-left-72 md:left-0' : 'left-0 md:-left-72'"
  >
    <div class="flex items-center justify-center pt-8 pb-6 text-(--ui-primary)">
      <div class="flex items-center text-2xl tracking-widest">
        <NuxtImg src="/logo.webp" class="h-14 w-14" />
        <span>
          BERKAH <br />
          AMANAH
        </span>
      </div>
    </div>
    <UNavigationMenu
      orientation="vertical"
      :items="sidebarItems"
      class="w-full"
      :ui="{
        label: 'text-sm uppercase text-(--ui-primary) mb-2',
        link: 'text-base py-2',
        root: 'px-4',
        separator: 'h-0',
      }"
    />
  </aside>
  <div
    v-if="!sidebarState"
    class="fixed top-0 left-0 z-10 h-full w-full bg-black/20 md:hidden"
    @click="sidebarState = true"
  />
  <ClientOnly>
    <USlideover
      v-if="!isDesktop"
      side="left"
      :open="!sidebarState"
      title="Menu"
      @update:open="(val: boolean) => (sidebarState = !val)"
    >
      <template #body>
        <aside class="overflow-auto">
          <UNavigationMenu
            orientation="vertical"
            :items="sidebarItems"
            class="w-full"
            :ui="{
              label: 'text-sm uppercase text-(--ui-primary) mb-2',
              link: 'text-base py-2',
              separator: 'h-0',
            }"
          />
        </aside>
      </template>
    </USlideover>
  </ClientOnly>
</template>
