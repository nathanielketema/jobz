<script lang="ts">
    import { delete_job, insert_job, list_jobs } from "./jobs.remote";

    const job_fields = insert_job.fields;

    const enhance = insert_job.enhance(async (form) => {
        submit_error = null;
        try {
            const ok = await form.submit();
            if (ok) {
                list_jobs().refresh();
                entry = false;
            }
        } catch (e) {
            submit_error = "Something went wrong. Please try again.";
        }
    });

    let entry = $state(false);
    let submit_error = $state<string | null>(null);

    function on_entry() {
        entry = true;
        submit_error = null;
    }
</script>

<!-- TODO(#6): fix the multiple source of truths for `select` tags. -->
<!-- Everything should come from the schema. Even the html tags. -->
<!-- - These laters can be capitalized using css -->
<!-- - This file should not know anything about the database -->
<!-- - The ui layout should only be driven from the schema -->
<!-- - If possible everyting from title to select elements should come -->
<!--   from the schema. -->
<main>
    <header>
        {#if entry}
            <!-- TODO(#3): better error handling/reporting -->
            <form {...enhance}>
                <section>
                    <label>
                        <b>Company name:</b>
                        <input {...job_fields.company.as("text")}>
                    </label>
                    {#each job_fields.company.issues() ?? [] as issue}
                        <p>{issue.message}</p>
                    {/each}
                </section>
                <section>
                    <label>
                        <b>Link:</b>
                        <input {...job_fields.link.as("text")}>
                    </label>
                    {#each job_fields.link.issues() ?? [] as issue}
                        <p>{issue.message}</p>
                    {/each}
                </section>
                <section>
                    <label>
                        <b>Kind:</b>
                        <select {...job_fields.kind.as("select")}>
                            <option value="onsite" selected>Onsite</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </label>
                </section>
                <section>
                    <label>
                        <b>Type:</b>
                        <select {...job_fields.type.as("select")}>
                            <option value="full time">Full time</option>
                            <option value="part time">Part time</option>
                            <option value="internship" selected>Internship</option>
                        </select>
                    </label>
                </section>
                <section>
                    <label>
                        <b>Status:</b>
                        <select {...job_fields.status.as("select")}>
                            <option value="pending" selected>Pending</option>
                            <option value="rejected">Rejected</option>
                            <option value="next stage">Next stage</option>
                        </select>
                    </label>
                </section>
                <section class="button">
                    <button type="submit">Add</button>
                </section>
            </form>
        {:else}
            <button onclick={on_entry}>New Entry</button>
        {/if}
    </header>

    <table>
        <thead>
            <!-- TODO(#4): use your schema instead of hardcoding -->
            <tr>
                <td></td>
                <th>ID</th>
                <th>Company</th>
                <th>Kind</th>
                <th>Type</th>
                <th>Date applied</th>
                <th>Status</th>
            </tr>
            <tr>
                <!-- TODO(#5): apply table filters -->
                <td></td>
                <td>Sort</td>
                <td>
                    <input type="text" placeholder="Filter company...">
                </td>
                <td>
                    <select name="kind" id="kind">
                        <option value="all" selected>All</option>
                        <option value="onsite">Onsite</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </td>
                <td>
                    <select name="type" id="type">
                        <option value="all" selected>All</option>
                        <option value="full time">Full time</option>
                        <option value="part time">Part time</option>
                        <option value="internship">Internship</option>
                    </select>
                </td>
                <td>Sort</td>
                <td>
                    <select name="status" id="status">
                        <option value="all" selected>All</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="next stage">Next Stage</option>
                    </select>
                </td>
            </tr>
        </thead>
        <tbody>
            {#each await list_jobs() as job (job.id)}
                {@const row = delete_job.for(job.id)}
                <tr>
                    <td>
                        <form {...row}>
                            <input {...row.fields.id.as("hidden", job.id)} />
                            <button type="submit">x</button>
                        </form>
                    </td>
                    <td>{job.id}</td>
                    <td><a href={job.link}>{job.company}</a></td>
                    <td>{job.kind}</td>
                    <td>{job.type}</td>
                    <td>{job.date_applied}</td>
                    <td data-status={job.status}>{job.status}</td>
                </tr>
            {:else}
                <tr>
                    <td colspan="7">No applications yet.</td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>

<style> 
    /* TODO(#2): cleanup color style */
    header {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-width: 40ch;

        button {
            align-self: flex-end;
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

        form {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;

            section.button {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: 50%;

                button {
                    width: 20%;
                }
            }

            section {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 100%;
                gap: 0.6rem;

                p {
                    font-size: 0.6rem;
                    color: red;
                }

                label {
                    align-self: flex-start;
                    display: flex;
                    justify-content: flex-start;
                    width: 50%;
                    gap: 0.6rem;

                    b {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        width: 40%;
                    }

                    input {
                        width: 60%;
                    }

                    select {
                        width: 30%;
                    }
                }
            }
        }
    }

    table {
        border-collapse: collapse;
        background: white;
        table-layout: fixed;
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
            text-transform: capitalize;
            letter-spacing: 0.5px;
        }

        tr:hover {
            background: #f5f5f5;

            td:first-child {
                opacity: 1;
                background: white;
            }
        }

        td[data-status="pending"]   { color: orange; }
        td[data-status="rejected"]  { color: red; }
        td[data-status="next stage"] { color: green; }

        td[colspan="7"] {
            text-align: center;
            padding: 3rem;
            color: #666;
            font-style: italic;
        }

        input, select {
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
