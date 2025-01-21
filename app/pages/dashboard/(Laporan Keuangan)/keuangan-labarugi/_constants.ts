export const columns = [
  {
    key: "namaAkun",
    label: "Nama Akun",
  },
  {
    key: "jan",
    label: "Januari",
  },
  {
    key: "feb",
    label: "Februari",
  },
  {
    key: "mar",
    label: "Maret",
  },
  {
    key: "apr",
    label: "April",
  },
  {
    key: "may",
    label: "Mei",
  },
  {
    key: "jun",
    label: "Juni",
  },
  {
    key: "jul",
    label: "Juli",
  },
  {
    key: "aug",
    label: "Agustus",
  },
  {
    key: "sep",
    label: "September",
  },
  {
    key: "oct",
    label: "Oktober",
  },
  {
    key: "nov",
    label: "November",
  },
  {
    key: "dec",
    label: "Desember",
  },
  {
    key: "total",
    label: "Total",
  },
];

const currentYear = new Date().getFullYear();
export const tahunOptions = [
  "Semua",
  String(currentYear - 1),
  String(currentYear),
  String(currentYear + 1),
];
