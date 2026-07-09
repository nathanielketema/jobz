import z from "zod";

const EnvSchema = z.object({
    DATABASE_URL: z.string().default("file:local.db"),
});
export type Env = z.infer<typeof EnvSchema>;

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
    console.error("error: invalid environment variable");
    console.error(z.treeifyError(result.error).properties);
    process.exit(1);
}

const env: Env = result.data;
export default env;
