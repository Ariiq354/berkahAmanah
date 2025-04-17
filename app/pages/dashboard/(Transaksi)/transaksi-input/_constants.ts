import * as v from "valibot";

export const columns = [
  {
    accessorKey: "kodeTransaksi",
    header: "Kode",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "kodeAkun",
    header: "Kode Akun",
  },
  {
    accessorKey: "namaAkun",
    header: "Nama Akun",
  },
  {
    accessorKey: "nilai",
    header: "Nilai",
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
];

export const schema = v.object({
  kodeAkun: v.string(),
  keterangan: v.string(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export const getInitialFormData = (): Schema => ({
  kodeAkun: "",
  keterangan: "",
  nilai: 0,
  tanggal: "",
});

export type Schema = v.InferOutput<typeof schema>;

export const akunOptions = [
  {
    name: "Pendapatan Adminstrasi Akad",
    value: "1020500",
  },
  {
    name: "Pendapatan Bagi Hasil Tabungan",
    value: "3010201",
  },
  {
    name: "Pendapatan Bagi Hasil Investasi",
    value: "3010204",
  },
  {
    name: "Pendapatan Penjualan Mobil",
    value: "3010105",
  },
  {
    name: "Pendapatan Penjualan Hewan Kurban",
    value: "3010107",
  },
  {
    name: "Pendapatan Lain-Lain",
    value: "3010106",
  },
  {
    name: "Setoran Bank Muamalat",
    value: "1010201",
  },
  {
    name: "Setoran Bank BSM",
    value: "1010202",
  },
  {
    name: "Setoran Bank BCA",
    value: "1010203",
  },
  {
    name: "Penarikan Bank Muamalat",
    value: "1010101",
  },
  {
    name: "Penarikan Bank BSM",
    value: "1010102",
  },
  {
    name: "Penarikan Bank BCA",
    value: "1010103",
  },
  {
    name: "Biaya Bank Muamalat",
    value: "3030701",
  },
  {
    name: "Biaya Bank BSM",
    value: "3030702",
  },
  {
    name: "Biaya ATK",
    value: "3030200",
  },
  {
    name: "Biaya Transport",
    value: "3030301",
  },
  {
    name: "Biaya Pajak",
    value: "3030900",
  },
  {
    name: "Biaya Penyusutan",
    value: "3031000",
  },
  {
    name: "Biaya Zakat Tijaroh",
    value: "3031200",
  },
  {
    name: "Biaya Gaji Pegawai",
    value: "3030100",
  },
  {
    name: "Biaya Lain-lain",
    value: "3031300",
  },
  {
    name: "Pengembalian Dana Wakalah",
    value: "1030102",
  },
  {
    name: "Pembelian Galon",
    value: "1050400",
  },
  {
    name: "Laba Ditahan",
    value: "2020401",
  },
  {
    name: "Pembagian SHU",
    value: "2020500",
  },
];
