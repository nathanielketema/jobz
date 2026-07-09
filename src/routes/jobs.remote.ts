import z from "zod";
import { form, query } from "$app/server";
import db from "$lib/server/db";
import { jobs } from "$lib/server/db/schema";

export const list_jobs = query(async () => {
    return db.query.jobs.findMany();
});

const new_job_application = z.object({
    company: z.string().nonempty(),
    kind: z.enum(["hybrid", "remote", "onsite"]).default("onsite"),
    link: z.string().nonempty(),
    type: z.enum(["full time", "part time", "internship"]).default("internship"),
    status: z.enum(["pending", "rejected", "next stage"]).default("pending"),
});

export const add_job = form(new_job_application, async (data) => {
    await db.insert(jobs).values({
        company: data.company,
        kind: data.kind,
        link: data.link,
        type: data.type,
        status: data.status,
    });
});
