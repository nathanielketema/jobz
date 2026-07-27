<script lang="ts">
    import { insert_job } from "./jobs.remote";

    const insert_fields = insert_job.fields;

    let { enhance, fields, select_options } = $props();

    function format_field(field: string): string {
        return field.replace(/_/g, " ");
    }
</script>

<form {...enhance}>
    {#each fields as field}
        {@const issues = insert_fields[field].issues() ?? []}
        <section>
            <label>
                <b>{format_field(field)}:</b>
                {#if select_options[field]}
                    <select {...insert_fields[field].as("select")}>
                        {#each select_options[field] as opt}
                            <option value={opt}>{format_field(opt)}</option>
                        {/each}
                    </select>
                {:else if field === "link"}
                    <input {...insert_fields[field].as("url")}>
                {:else}
                    <input {...insert_fields[field].as("text")}>
                {/if}
            </label>
            {#each issues as issue}
                <p>{issue.message}</p>
            {/each}
        </section>
    {/each}
    <section class="button">
        <button type="submit">Add</button>
    </section>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
        text-transform: capitalize;

        section.button {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 50%;

            button {
                padding: 0.5rem;
                border: 1px solid black;
                margin-top: 1rem;
                margin-bottom: 1rem;
                font-weight: 600;
                width: 20%;
                cursor: pointer;

                &:hover {
                    background: blue;
                    color: white;
                }
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
</style>
