export type SetoranResponse = {
  id: number;
  anggotaId: number;
  keterangan: string;
  kodeTransaksi: string;
  nilai: number;
  tanggal: string;
  jenis: "Saham" | "Simpanan";
  jumlahSaham: number;
  status: number;
  namaLengkap: string;
};
