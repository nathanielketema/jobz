import { defineConfig } from "drizzle-kit";
import env from "./src/lib/env";

export default defineConfig({
    schema: "./src/lib/server/db/schema.ts",
    out: "./src/lib/server/db/migrations",
    dialect: "sqlite",
    dbCredentials: { url: env.DATABASE_URL },
    verbose: true,
    strict: true,
});
