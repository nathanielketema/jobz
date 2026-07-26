import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import z from "zod";
import { form, query } from "$app/server";
import db from "$lib/server/db";
import { jobs } from "$lib/server/db/schema";

export const list_jobs = query(async () => {
    try {
        return await db.query.jobs.findMany();
    } catch (e) {
        console.error("Failed to list jobs:", e);
        error(500, "Failed to load jobs. Please try again.");
    }
});

const new_job = z.object({
    company: z.string().nonempty("Company name is required"),
    kind: z.enum(["hybrid", "remote", "onsite"]).default("onsite"),
    link: z.string().nonempty("Link is required"),
    type: z.enum(["full time", "part time", "internship"]).default("internship"),
    status: z.enum(["pending", "rejected", "next stage"]).default("pending"),
});

export const insert_job = form(new_job, async (data) => {
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

export const delete_job = form(z.object({ id: z.number().int() }), async (data) => {
    try {
        await db.delete(jobs).where(eq(jobs.id, data.id));
        await list_jobs().refresh();
    } catch (e) {
        console.error("failed to delete job:", e);
        error(500, "Failed to delete job. Please try again.");
    }
});
