export const columns = [
  {
    accessorKey: "namaAkun",
    header: "Nama Akun",
  },
  {
    accessorKey: "jan",
    header: "Januari",
  },
  {
    accessorKey: "feb",
    header: "Februari",
  },
  {
    accessorKey: "mar",
    header: "Maret",
  },
  {
    accessorKey: "apr",
    header: "April",
  },
  {
    accessorKey: "may",
    header: "Mei",
  },
  {
    accessorKey: "jun",
    header: "Juni",
  },
  {
    accessorKey: "jul",
    header: "Juli",
  },
  {
    accessorKey: "aug",
    header: "Agustus",
  },
  {
    accessorKey: "sep",
    header: "September",
  },
  {
    accessorKey: "oct",
    header: "Oktober",
  },
  {
    accessorKey: "nov",
    header: "November",
  },
  {
    accessorKey: "dec",
    header: "Desember",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
];

const currentYear = new Date().getFullYear();
export const tahunOptions = [
  "Semua",
  String(currentYear - 1),
  String(currentYear),
  String(currentYear + 1),
];
