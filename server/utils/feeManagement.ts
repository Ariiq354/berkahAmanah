import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewFeeManagement,
  feeManagementTable,
} from "~~/server/database/schema/transaksi";

export async function getAllFeeManagement() {
  return await db.query.feeManagementTable.findMany({
    orderBy: desc(feeManagementTable.createdAt),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
        },
      },
    },
  });
}

export async function createFeeManagement(data: NewFeeManagement) {
  return await db.insert(feeManagementTable).values(data);
}

export async function updateFeeManagement(
  id: number,
  data: Partial<NewFeeManagement>
) {
  return await db
    .update(feeManagementTable)
    .set(data)
    .where(eq(feeManagementTable.id, id));
}

export async function deleteFeeManagement(id: number[]) {
  return await db
    .delete(feeManagementTable)
    .where(inArray(feeManagementTable.id, id));
}
