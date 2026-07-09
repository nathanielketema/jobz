import { defineRelations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-orm/zod";

export const jobs = sqliteTable("jobs", {
    id: integer().primaryKey({ autoIncrement: true }),
    company: text("title").notNull(),
    kind: text("kind").$type<"hybrid" | "remote" | "onsite">().default("onsite"),
    link: text("link").notNull().unique(),
    type: text("type").$type<"full time" | "part time" | "internship">().default("internship"),
    date_applied: text().$defaultFn(() => new Date().toLocaleDateString()).notNull(),
    status: text("status").$type<"pending" | "rejected" | "next stage">().default("pending"),
});

export const JobsSchema = createSelectSchema(jobs);

export const relations = defineRelations({ jobs });
