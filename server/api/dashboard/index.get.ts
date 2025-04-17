export default eventHandler(async (event) => {
  protectFunction(event);

  const pemilikSaham = await getPemilikSaham();
  const pemilikTabungan = await getPemilikSimpanan();
  const nasabahPembiayaan = await getNasabahPembiayaan();
  const antrianPembiayaan = await getAntrianPembiayaan();
  const dataAthar = await getDataPenjualan();
  const dataPembiayaan = await getDataPembiayaan();
  const dataSaham = await getDataSaham();
  const dataLaba = await getLaba();

  const labaDatasets = [
    {
      label: "Profit",
      data: dataLaba,
      borderWidth: 1,
    },
  ];
  const atharDatasets = [
    {
      label: "Penjualan Athar",
      data: dataAthar,
      borderWidth: 1,
    },
  ];
  const sahamDatasets = [
    {
      label: "Nilai Saham",
      data: dataSaham,
      fill: true,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.4,
    },
  ];
  const pembiayaanDatasets = [
    {
      label: "Pembiayaan",
      data: dataPembiayaan,
      borderWidth: 1,
    },
  ];

  return {
    pemilikSaham,
    pemilikTabungan,
    nasabahPembiayaan,
    antrianPembiayaan,
    atharDatasets,
    labaDatasets,
    sahamDatasets,
    pembiayaanDatasets,
  };
});
