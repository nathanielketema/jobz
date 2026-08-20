import { defineRelations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import z from "zod";

const kind = ["onsite", "hybrid", "remote"] as const;
const type = ["internship", "full_time", "part_time"] as const;
const status = ["pending", "rejected", "advance", "accepted", "failed"] as const;

export const jobs = sqliteTable("jobs", {
    id: integer().primaryKey({ autoIncrement: true }),
    company: text().notNull(),
    link: text().notNull().unique(),
    kind: text({ enum: kind }).default("onsite"),
    type: text({ enum: type }).default("full_time"),
    status: text({ enum: status }).default("pending"),
    date_applied: text()
        .$defaultFn(() => new Date().toISOString().split("T")[0])
        .notNull(),
});

export const SchemaInsert = createInsertSchema(jobs, {
    company: z.string({ error: "Company name is required" }).nonempty(),
    link: z.url({ error: "Must be a valid URL" }),
    kind: z.enum(kind).default("onsite"),
    type: z.enum(type).default("full_time"),
    status: z.enum(status).default("pending"),
}).omit({
    id: true,
    date_applied: true,
});

export const SchemaSelect = createSelectSchema(jobs, {
    kind: z.enum(kind),
    type: z.enum(type),
    status: z.enum(status),
});

export const SchemaDelete = createSelectSchema(jobs).pick({ id: true });

export const SchemaUpdate = SchemaInsert.extend({
    id: SchemaDelete.shape.id,
});

export const SchemaFields = SchemaSelect.omit({ link: true });
export const job_fields = Object.keys(SchemaFields.shape);

export type JobSelect = z.infer<typeof SchemaSelect>;
export type JobInsert = z.infer<typeof SchemaInsert>;
export type JobFields = z.infer<typeof SchemaFields>;

export const relations = defineRelations({ jobs });
