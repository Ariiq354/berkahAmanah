import * as v from "valibot";
import { setoranTable } from "~~/server/database/schema/simpanan";
import { OSetoranCreate } from "~~/server/utils/v1/setoran/dto/create-setoran.dto";

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    v.parse(OSetoranCreate, body)
  );

  const kodeTransaksi = await getTransactionCode("STR", setoranTable);

  if (user.role !== "admin") {
    formData.anggotaId = user.id;
  }

  await createSetoran(formData, kodeTransaksi);

  return HttpResponse();
});
