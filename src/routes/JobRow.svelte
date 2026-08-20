<script lang="ts">
    import type { JobFields, JobSelect } from "$lib/server/db/schema";
    import { delete_job, update_job } from "./jobs.remote";

    let {
        job,
        fields,
        select_options,
    }: {
        job: JobSelect;
        fields: (keyof JobFields)[];
        select_options: Record<"kind" | "type" | "status", readonly string[]>;
    } = $props();

    const job_id = $derived(job.id);
    const update = $derived(update_job.for(job_id));
    const update_form_id = $derived(`update-job-${job_id}`);

    let editing = $state(false);
    let update_error = $state<string | null>(null);

    const update_enhance = $derived(
        update.enhance(async (form) => {
            update_error = null;

            try {
                const ok = await form.submit();
                if (ok) {
                    editing = false;
                } else {
                    update_error = "Please fix the validation errors in this row.";
                }
            } catch {
                update_error = "Something went wrong. Please try again.";
            }
        }),
    );

    function begin_edit() {
        update.fields.set({
            id: job.id,
            company: job.company,
            link: job.link,
            kind: job.kind,
            type: job.type,
            status: job.status,
        });
        update_error = null;
        editing = true;
    }

    function format_field(field: unknown): string {
        if (typeof field !== "string") return String(field);
        return field.replace(/_/g, " ");
    }
</script>

<tr class:editing>
    <td class="actions">
        {#if editing}
            <form {...update_enhance} id={update_form_id}>
                <input {...update.fields.id.as("hidden", job.id)} />
                <button type="submit">Save</button>
                <button type="button" onclick={() => (editing = false)}>Cancel</button>
            </form>
            {#if update_error}
                <p role="alert">{update_error}</p>
            {/if}
        {:else}
            {@const remove = delete_job.for(job.id)}
            <div class="row-actions">
                <button class="edit" type="button" onclick={begin_edit}>🔁</button>
                <form class="delete" {...remove}>
                    <input {...remove.fields.id.as("hidden", job.id)} />
                    <button type="submit" aria-label="Delete entry" title="Delete entry">x</button>
                </form>
            </div>
        {/if}
    </td>
    {#each fields as field}
        {#if field === "company"}
            <td>
                {#if editing}
                    <input
                        {...update.fields.company.as("text")}
                        form={update_form_id}
                        aria-label="Company name"
                    />
                    <input
                        class="link"
                        {...update.fields.link.as("url")}
                        form={update_form_id}
                        aria-label="Application link"
                    />
                {:else}
                    <a href={job.link}>{format_field(job.company)}</a>
                {/if}
            </td>
        {:else if field === "status"}
            <td data-status={job.status}>
                {#if editing}
                    <select {...update.fields.status.as("select")} form={update_form_id} aria-label="Status">
                        {#each select_options.status as option}
                            <option value={option}>{format_field(option)}</option>
                        {/each}
                    </select>
                {:else}
                    {format_field(job.status!)}
                {/if}
            </td>
        {:else if field === "kind" || field === "type"}
            <td>
                {#if editing}
                    <select {...update.fields[field].as("select")} form={update_form_id} aria-label={field}>
                        {#each select_options[field] as option}
                            <option value={option}>{format_field(option)}</option>
                        {/each}
                    </select>
                {:else}
                    {format_field(job[field])}
                {/if}
            </td>
        {:else}
            <td>{format_field(job[field])}</td>
        {/if}
    {/each}
</tr>

<style>
    td {
        padding: 0.75rem 1rem;
        text-align: center;
        border: 1px solid black;
    }

    .actions > form {
        display: inline;
    }

    .row-actions {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.4rem;
    }

    .actions {
        border: none;
        opacity: 0;
    }

    .actions button {
        color: red;
        border: none;
        font-size: 1.2rem;
        background: none;
        cursor: pointer;
    }

    .actions .edit {
        color: inherit;
        font-size: inherit;
    }

    tr:hover {
        background: #f5f5f5;
    }

    tr:hover .actions {
        opacity: 1;
        background: white;
    }

    tr.editing .actions {
        opacity: 1;
        background: white;
    }

    tr.editing .actions > form {
        display: flex;
        justify-content: center;
        gap: 0.4rem;
    }

    tr.editing button[type="submit"] {
        color: green;
        font-size: inherit;
    }

    tr.editing button[type="button"] {
        color: inherit;
        font-size: inherit;
    }

    p {
        margin-top: 0.3rem;
        color: red;
        font-size: 0.75rem;
        line-height: 1rem;
    }

    input.link {
        margin-top: 0.4rem;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        text-align: left;
        font-family: inherit;
        font-size: 0.75rem;
    }

    select {
        width: 100%;
        font: inherit;
    }

    td[data-status="pending"]  { color: orange; }
    td[data-status="rejected"] { color: red; }
    td[data-status="advance"]  { color: blue; }
    td[data-status="accepted"] { color: green; }
    td[data-status="failed"] { color: pink; }

    a {
        color: #2156a5;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
