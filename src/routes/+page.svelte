<script lang="ts">
    import EntryForm from "./EntryForm.svelte";
    import { delete_job, insert_job, job_meta_data, select_jobs } from "./jobs.remote";

    const meta = job_meta_data();

    let entry_new = $state(false);
    let submit_error = $state<string | null>(null);
    let delete_error = $state<string | null>(null);
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
        <thead>
            <tr>
                <td></td>
                {#each fields as field}
                    <th>{format_table_title(field)}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each await select_jobs() as job (job.id)}
                {@const row = delete_job.for(job.id)}
                <tr>
                    <td>
                        <form {...row}>
                            <input {...row.fields.id.as("hidden", job.id)} />
                            <button type="submit">x</button>
                        </form>
                    </td>
                    {#each fields as field}
                        {#if field === "status"}
                            <td data-status={job.status}>{format_field(job.status!)}</td>
                        {:else if field === "company"}
                            <td><a href={job.link}>{format_field(job.company)}</a></td>
                        {:else}
                            <td>{format_field(job[field])}</td>
                        {/if}
                    {/each}
                </tr>
            {:else}
                <tr>
                    <td colspan="7">No applications yet.</td>
                </tr>
            {/each}
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

        th, td {
            padding: 0.75rem 1rem;
            text-align: center;
            border: 1px solid black;
        }

        td:first-child {
            border: none;
            opacity: 0;

            button {
                color: red;
                border: none;
                font-size: 1.2rem;
                background: none;
                cursor: pointer;
            }
        }

        th {
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        tr:hover {
            background: #f5f5f5;

            td:first-child {
                opacity: 1;
                background: white;
            }
        }

        td[data-status="pending"]  { color: orange; }
        td[data-status="rejected"] { color: red; }
        td[data-status="advance"]  { color: blue; }
        td[data-status="accepted"] { color: green; }

        td[colspan="7"] {
            text-align: center;
            padding: 3rem;
            color: #666;
            font-style: italic;
        }

        input {
            width: 100%;
            padding: 0.5rem;
            text-align: left;
            font-family: inherit;
            font-size: 0.75rem;
        }

        a {
            color: #2156a5;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>
