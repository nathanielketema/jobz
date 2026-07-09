import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import env from "$lib/env";
import { relations } from "./schema";

const client = createClient({ url: env.DATABASE_URL });
const db = drizzle({ client, relations });

export default db;
