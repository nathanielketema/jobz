<script lang="ts">
    import type { JobFields, JobSelect } from "$lib/server/db/schema";
    import EntryForm from "./EntryForm.svelte";
    import JobRow from "./JobRow.svelte";
    import { insert_job, job_meta_data, select_jobs } from "./jobs.remote";

    const meta = job_meta_data();
    const jobs = select_jobs();

    let entry_new = $state(false);
    let submit_error = $state<string | null>(null);
    let delete_error = $state<string | null>(null);
    let filters = $state<Record<keyof JobFields, string>>({
        id: "",
        company: "",
        kind: "",
        type: "",
        status: "",
        date_applied: "",
    });
    const enhance = insert_job.enhance(async (form) => {
        submit_error = null;
        try {
            const ok = await form.submit();
            if (ok) {
                entry_new = false;
            } else {
                submit_error = "Please fix the validation errors above.";
            }
        } catch {
            submit_error = "Something went wrong. Please try again.";
        }
    });

    function new_entry() {
        entry_new = true;
        submit_error = null;
        // Default values taken from the $lib/schema.ts
        insert_job.fields.set({
            kind: "onsite",
            type: "internship",
            status: "pending",
        });
    }

    function format_table_title(title: string): string {
        const string_formatted = format_field(title);
        return string_formatted === "id" ? string_formatted.toUpperCase() : string_formatted;
    }

    function format_field(field: unknown): string {
        if (typeof field !== "string") return String(field);
        return field.replace(/_/g, " ");
    }

    function clear_filters() {
        filters = {
            id: "",
            company: "",
            kind: "",
            type: "",
            status: "",
            date_applied: "",
        };
    }

    function filtered_jobs(job_list: JobSelect[]) {
        return job_list.filter((job) =>
            Object.entries(filters).every(([field, filter]) => {
                return String(job[field as keyof JobFields])
                    .toLowerCase()
                    .includes(filter.trim().toLowerCase());
            }),
        );
    }
</script>

<main>
    {#await meta then { fields, kind, type, status, insert_fields }}
    {@const select_options = { kind, type, status }}
    <header>
        {#if entry_new}
            <EntryForm {enhance} fields={insert_fields} {select_options}/>
        {:else}
            <button onclick={new_entry}>New Entry</button>
        {/if}
    </header>

    {#if submit_error || delete_error}
        <p role="alert">{submit_error ?? delete_error}</p>
    {/if}

    <table>
        <colgroup>
            <col />
            <col class="id-column" />
        </colgroup>
        <thead>
            <tr>
                <td></td>
                {#each fields as field}
                    <th>{format_table_title(field)}</th>
                {/each}
            </tr>
            <tr class="filters">
                <td>
                    <button type="button" onclick={clear_filters} aria-label="Clear filters" title="Clear filters">x</button>
                </td>
                {#each fields as field}
                    <td>
                        {#if field === "kind" || field === "type" || field === "status"}
                            <select bind:value={filters[field]} aria-label={`Filter by ${format_field(field)}`}>
                                <option value="">All</option>
                                {#each select_options[field] as option}
                                    <option value={option}>{format_field(option)}</option>
                                {/each}
                            </select>
                        {:else}
                            <input
                                type="search"
                                bind:value={filters[field]}
                                aria-label={`Filter by ${format_field(field)}`}
                            />
                        {/if}
                    </td>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#await jobs then job_list}
                {#if job_list.length}
                    {#each filtered_jobs(job_list) as job (job.id)}
                        <JobRow {job} {fields} {select_options} />
                    {:else}
                        <tr>
                            <td colspan="7">No matching applications.</td>
                        </tr>
                    {/each}
                {:else}
                    <tr>
                        <td colspan="7">No applications yet.</td>
                    </tr>
                {/if}
            {/await}
        </tbody>
        </table>
    {/await}
</main>

<style> 
    /* TODO(#2): cleanup color style */
    header {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-width: 40ch;

        > button {
            align-self: center;
            padding: 0.5rem;
            border: 1px solid black;
            margin-top: 1rem;
            margin-bottom: 1rem;
            font-weight: 600;
            width: 30%;
            cursor: pointer;

            &:hover {
                background: blue;
                color: white;
            }
        }
    }

    p {
        columns: red;
    }

    table {
        border-collapse: collapse;
        background: white;
        table-layout: fixed;
        text-transform: capitalize;
        min-width: 80ch;

        col.id-column {
            width: 1%;
        }

        th, td {
            padding: 0.75rem 1rem;
            text-align: center;
            border: 1px solid black;
        }

        td:first-child {
            border: none;
        }

        th {
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        tr:hover {
            background: #f5f5f5;

            td:first-child { background: white; }
        }

        td[colspan="7"] {
            text-align: center;
            padding: 3rem;
            color: #666;
            font-style: italic;
        }

        tr.filters {
            background: white;
            text-transform: none;

            td {
                padding: 0.35rem;
            }

            td:first-child {
                opacity: 0;
            }

            &:hover td:first-child {
                opacity: 1;
            }

            input,
            select {
                width: 100%;
                border: 1px solid black;
                padding: 0.3rem;
                background: white;
                font: inherit;
            }

            button {
                color: red;
                border: none;
                background: none;
                cursor: pointer;
                font: inherit;
            }
        }
    }
</style>
