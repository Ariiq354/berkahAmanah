import * as v from "valibot";
import { HttpResponse } from "~~/server/utils/common/function";
import { OSaldoSimpanan } from "~~/server/utils/v1/simpanan/dto/list-simpanan.dto";

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

  return new HttpResponse()
    .setData({
      saldo,
    })
    .getResponse();
});
