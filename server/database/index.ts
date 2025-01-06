import { drizzle } from "drizzle-orm/libsql";
import * as auth from "./schema/auth";
import * as transaksi from "./schema/transaksi";
import * as simpanan from "./schema/simpanan";
import * as saham from "./schema/saham";

const config = useRuntimeConfig();

export const db = drizzle({
  connection: {
    url: config.databaseUrl as string,
    authToken: config.databaseAuthToken as string,
  },
  schema: {
    ...auth,
    ...transaksi,
    ...simpanan,
    ...saham,
  },
  casing: "snake_case",
});
