export default eventHandler(async (event) => {
  protectFunction(event);

  const pemilikSaham = await getPemilikSaham();
  const pemilikTabungan = await getPemilikSimpanan();
  const nasabahPembiayaan = await getNasabahPembiayaan();
  const antrianPembiayaan = await getAntrianPembiayaan();
  const dataAthar = await getDataPenjualan();
  const dataPembiayaan = await getDataPembiayaan();
  const dataSaham = await getDataSaham();

  return {
    pemilikSaham,
    pemilikTabungan,
    nasabahPembiayaan,
    antrianPembiayaan,
    dataAthar,
    dataPembiayaan,
    dataSaham,
  };
});
