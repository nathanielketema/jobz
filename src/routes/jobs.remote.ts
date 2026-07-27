import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { form, prerender, query } from "$app/server";
import db from "$lib/server/db";
import {
    jobs,
    job_fields,
    SchemaDelete,
    SchemaInsert,
    SchemaSelect,
    type JobFields,
    type JobInsert,
} from "$lib/server/db/schema";

export const job_meta_data = prerender(() => {
    return {
        fields: job_fields as (keyof JobFields)[],
        kind: SchemaSelect.shape.kind.options,
        type: SchemaSelect.shape.type.options,
        status: SchemaSelect.shape.status.options,
        insert_fields: Object.keys(SchemaInsert.shape) as (keyof JobInsert)[],
    };
});

export const select_jobs = query(async () => {
    try {
        return await db.query.jobs.findMany();
    } catch (e) {
        console.error("Failed to list jobs:", e);
        error(500, "Failed to load jobs. Please try again.");
    }
});

export const insert_job = form(SchemaInsert, async (data) => {
    try {
        await db.insert(jobs).values({
            company: data.company,
            kind: data.kind,
            link: data.link,
            type: data.type,
            status: data.status,
        });
    } catch (e) {
        console.error("failed to insert job:", e);
        error(500, "Failed to add job. Please try again.");
    }
});

export const delete_job = form(SchemaDelete, async (data) => {
    try {
        await db.delete(jobs).where(eq(jobs.id, data.id));
    } catch (e) {
        console.error("failed to delete job:", e);
        error(500, "Failed to delete job. Please try again.");
    }
});
