<script lang="ts">
    import { add_job, list_jobs } from "./jobs.remote";

    const { company, kind, link, type, status } = add_job.fields;

    let entry = $state(false);
    function on_entry() {
        entry = true;
    }

    function on_submit() {
        list_jobs().refresh();
        entry = false;
    }
</script>

<!-- TODO(#1): fix the multiple source of truths for `select` tags. -->
<main>
    <header>
        {#if entry}
            <form {...add_job}>
                <label>
                    <b>Company name:</b>
                    <input {...company.as("text")}>
                </label>
                <label>
                    <b>Link:</b>
                    <input {...link.as("text")}>
                </label>
                <label>
                    <b>Kind:</b>
                    <select {...kind.as("select")}>
                        <option value="onsite" selected>Onsite</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </label>
                <label>
                    <b>Type:</b>
                    <select {...type.as("select")}>
                        <option value="full time">Full time</option>
                        <option value="part time">Part time</option>
                        <option value="internship" selected>Internship</option>
                    </select>
                </label>
                <label>
                    <b>Status:</b>
                    <select {...status.as("select")}>
                        <option value="pending" selected>Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="next stage">Next stage</option>
                    </select>
                </label>
                <section>
                    <button onclick={on_submit}>Add</button>
                </section>
            </form>
        {:else}
            <button onclick={on_entry}>New Entry</button>
        {/if}
    </header>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Kind</th>
                <th>Type</th>
                <th>Date applied</th>
                <th>Status</th>
            </tr>
            <tr>
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
                        <option value="nextround">Next round</option>
                    </select>
                </td>
            </tr>
        </thead>
        <tbody>
            {#each await list_jobs() as job (job.id)}
                <tr>
                    <td>{job.id}</td>
                    <td><a href={job.link}>{job.company}</a></td>
                    <td>{job.kind}</td>
                    <td>{job.type}</td>
                    <td>{job.date_applied}</td>
                    <td data-status={job.status}>{job.status}</td>
                </tr>
            {:else}
                <tr>
                    <td colspan="6">No applications yet.</td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>

<style> 
    /* TODO: cleanup color style */
    table {
        border-collapse: collapse;
        background: white;
        table-layout: fixed;
        min-width: 80ch;
    }

    th, td {
        padding: 0.75rem 1rem;
        text-align: center;
        border: 1px solid black;
    }

    th {
        font-weight: 600;
        text-transform: capitalize;
        letter-spacing: 0.5px;
    }

    tr:hover {
        background: #f5f5f5;
    }

    [data-status="pending"]   { color: #d97706; }
    [data-status="rejected"]  { color: #b91c1c; }
    [data-status="next stage"] { color: #15803d; }

    td[colspan="6"] {
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

    header {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-width: 40ch;

        form {
            align-self: flex-start;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;

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
                    width: 25%;
                }
            }

            section {
                align-self: flex-start;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50%;

                button {
                    width: 20%;
                }
            }
        }

        button {
            align-self: flex-end;
            padding: 0.5rem;
            border: 1px solid black;
            margin-top: 1rem;
            margin-bottom: 1rem;
            font-weight: 600;
            width: 30%;

            &:hover {
                background: blue;
                color: white;
            }
        }
    }
</style>
