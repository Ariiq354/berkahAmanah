<script setup lang="ts">
  const sidebarState = useSidebarToggle();
  const user = useUser();

  const sidebarItems = [
    {
      title: "Dashboard",
      items: [
        {
          label: "Dashboard",
          link: "/dashboard",
          icon: "i-heroicons-home",
        },
        ...(user.value?.role === "admin"
          ? [
              {
                label: "Nilai Saham",
                link: "/dashboard/saham",
                icon: "i-heroicons-chart-bar-square",
              },
              {
                label: "Nilai Athar",
                link: "/dashboard/athar",
                icon: "i-heroicons-chart-bar-square",
              },
            ]
          : []),
      ],
    },
    {
      title: "User",
      items: [
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
              link: "/dashboard/simpanan-setoran",
            },
            {
              label: "Penarikan",
              link: "/dashboard/simpanan-penarikan",
            },
            {
              label: "Pemindahbukuan",
              link: "/dashboard/simpanan-pemindahbukuan",
            },
            {
              label: "Monitoring",
              link: "/dashboard/simpanan-monitoring",
            },
          ],
        },
        {
          label: "Pembiayaan",
          icon: "i-heroicons-banknotes",
          children: [
            {
              label: "Murabahah",
              link: "/dashboard/pembiayaan-murabahah",
            },
            {
              label: "Angsuran",
              link: "/dashboard/pembiayaan-angsuran",
            },
            {
              label: "Monitoring",
              link: "/dashboard/pembiayaan-monitoring",
            },
          ],
        },
      ],
    },
    ...(user.value?.role === "admin"
      ? [
          {
            title: "Admin",
            items: [
              {
                label: "Persetujuan",
                icon: "i-heroicons-clipboard-document-check",
                children: [
                  {
                    label: "Setoran",
                    link: "/dashboard/persetujuan-setoran",
                  },
                  {
                    label: "Penarikan",
                    link: "/dashboard/persetujuan-penarikan",
                  },
                  {
                    label: "Pemindahbukuan",
                    link: "/dashboard/persetujuan-pemindahbukuan",
                  },
                  {
                    label: "Murabahah",
                    link: "/dashboard/persetujuan-murabahah",
                  },
                  {
                    label: "Setoran Angsuran",
                    link: "/dashboard/persetujuan-angsuran",
                  },
                  {
                    label: "Anggota",
                    link: "/dashboard/persetujuan-anggota",
                  },
                ],
              },
              {
                label: "Distributor Athar",
                icon: "i-heroicons-truck",
                children: [
                  {
                    label: "Pembelian",
                    link: "/dashboard/athar-pembelian",
                  },
                  {
                    label: "Penjualan",
                    link: "/dashboard/athar-penjualan",
                  },
                  {
                    label: "Pembayaran Hutang",
                    link: "/dashboard/athar-pembayaran-hutang",
                  },
                  {
                    label: "Pembayaran",
                    link: "/dashboard/athar-pembayaran",
                  },
                  {
                    label: "Monitoring",
                  },
                ],
              },
              {
                label: "Monitoring",
                icon: "i-heroicons-presentation-chart-line",
                children: [
                  {
                    label: "Simpanan",
                    link: "/dashboard/monitoring-simpanan",
                  },
                  {
                    label: "Pembiayaan",
                    link: "/dashboard/monitoring-pembiayaan",
                  },
                  {
                    label: "SHU",
                  },
                  {
                    label: "Anggota",
                    link: "/dashboard/monitoring-anggota",
                  },
                ],
              },
              {
                label: "Transaksi",
                icon: "i-heroicons-calculator",
                children: [
                  {
                    label: "Daftar Akun",
                    link: "/dashboard/transaksi-akun",
                  },
                  {
                    label: "Daftar Transaksi",
                    link: "/dashboard/transaksi-transaksi",
                  },
                  {
                    label: "Input Transaksi",
                    link: "/dashboard/transaksi-input",
                  },
                  {
                    label: "Generate SHU",
                  },
                  {
                    label: "Input Fee Management",
                  },
                ],
              },
              {
                label: "Laporan Keuangan",
                icon: "i-heroicons-scale",
                children: [
                  {
                    label: "Neraca",
                    link: "/dashboard/keuangan-neraca",
                  },
                  {
                    label: "Laba Rugi",
                    link: "/dashboard/keuangan-labarugi",
                  },
                  {
                    label: "Posting",
                  },
                ],
              },
            ],
          },
        ]
      : []),
  ];

  const colorMode = useColorMode();
</script>

<template>
  <aside
    class="fixed top-0 z-20 h-full w-72 overflow-y-auto border-r border-gray-200 bg-white shadow-xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-900"
    :class="sidebarState ? '-left-72 md:left-0' : 'left-0 md:-left-72'"
  >
    <div class="text-primary flex items-center justify-center pb-8 pt-10">
      <div class="flex items-center">
        <NuxtImg
          v-if="colorMode.preference === 'light'"
          src="/logo_barokah_dark.webp"
          width="150"
        />
        <NuxtImg v-else width="150" src="/logo-barokah-white.webp" />
      </div>
    </div>
    <div v-for="(firstItem, firstIndex) in sidebarItems" :key="firstIndex">
      <h1 class="text-primary px-8 py-4 text-sm font-bold uppercase">
        {{ firstItem.title }}
      </h1>
      <nav :aria-label="firstItem.title + ' navigation'">
        <AppSidebarItem :link-item-prop="firstItem.items" :depth="0" />
      </nav>
    </div>
  </aside>
  <div
    v-if="!sidebarState"
    class="fixed left-0 top-0 z-10 h-full w-full bg-black/20 md:hidden"
    @click="sidebarState = true"
  />
</template>
