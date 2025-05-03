import * as v from "valibot";
import { OSaldoSimpanan } from "~~/server/services/v1/simpanan/dto/list-simpanan.dto";
import { getSaldoSimpanan } from "~~/server/services/v1/simpanan/simpanan.service";

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const query = await getValidatedQuery(event, (query) =>
    v.parse(OSaldoSimpanan, query)
  );

  let saldo;
  if (user.role !== "admin") {
    saldo = await getSaldoSimpanan({ anggotaId: user.id });
  } else {
    saldo = await getSaldoSimpanan(query);
  }

  return saldo;
});
