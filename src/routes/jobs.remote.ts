import db from "$lib/server/db";
import z from "zod";
import { form, query } from "$app/server";
import { jobs } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const list_jobs = query(async () => {
    return db.query.jobs.findMany();
});

const new_job = z.object({
    company: z.string().nonempty(),
    kind: z.enum(["hybrid", "remote", "onsite"]).default("onsite"),
    link: z.string().nonempty(),
    type: z.enum(["full time", "part time", "internship"]).default("internship"),
    status: z.enum(["pending", "rejected", "next stage"]).default("pending"),
});

export const insert_job = form(new_job, async (data) => {
    await db.insert(jobs).values({
        company: data.company,
        kind: data.kind,
        link: data.link,
        type: data.type,
        status: data.status,
    });
});

export const delete_job = form(z.object({ id: z.number().int() }), async (data) => {
    await db.delete(jobs).where(eq(jobs.id, data.id));
    await list_jobs().refresh();
});
