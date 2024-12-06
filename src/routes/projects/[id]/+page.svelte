<script lang="ts">
    import { goto, invalidate } from "$app/navigation";
    import DataTable from "../../../components/data-table.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
    import ChevronLeft from "lucide-svelte/icons/chevron-left";
    import Trash from "lucide-svelte/icons/trash-2";
    import Upload from "lucide-svelte/icons/upload";
    import DeleteProjectModal from "../../../components/delete-project-modal.svelte";
    import { Vulnerability } from "../../../schema/vulnerability";
    import {
        renderComponent,
        renderSnippet,
    } from "$lib/components/ui/data-table";
    import { createRawSnippet } from "svelte";
    import { Project } from "../../../schema/project";
    import DataTableSortableButton from "../../../components/data-table-sortable-button.svelte";
    import UpdateProjectModal from "../../../components/update-project-modal.svelte";

    const { data } = $props();
    let showDeleteProjectModal = $state(false);
    let showUpdateProjectModal = $state(false);
    let uploadFile = $state<File | undefined>();

    const formatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" });

    const COLUMNS_DEF = [
        {
            accessorKey: "date",
            header: ({
                column,
            }: {
                column: {
                    toggleSorting: (arg0: boolean) => void;
                    getIsSorted: () => string | boolean;
                };
            }) =>
                renderComponent(DataTableSortableButton, {
                    label: "Date",
                    onclick: () => {
                        return column.toggleSorting(
                            column.getIsSorted() === "asc" ||
                                column.getIsSorted() === false,
                        );
                    },
                }),
            cell: ({ row }: { row: { original: { date: string } } }) => {
                return formatter.format(
                    new Date(Date.parse(row.original.date)),
                );
            },
        },
        {
            accessorKey: "ref",
            header: "Ref",
        },
        {
            accessorKey: "name",
            header: "Nom",
            cell: ({ row }: { row: { original: { name: string } } }) => {
                const nameCellSnippet = createRawSnippet<[string]>(
                    (getName) => {
                        const name = getName();
                        return {
                            render: () => `<div class="max-w-xs">${name}</div>`,
                        };
                    },
                );

                return renderSnippet(nameCellSnippet, row.original.name);
            },
        },
        {
            accessorKey: "criticity",
            header: "Criticité",
            cell: ({ row }: { row: { original: { criticity: string } } }) => {
                const criticityCellSnippet = createRawSnippet<[string]>(
                    (getData) => {
                        const data = getData().split(":");
                        return {
                            render: () =>
                                `<div class="font-medium ${data[1]}">${data[0]}</div>`,
                        };
                    },
                );

                return renderSnippet(
                    criticityCellSnippet,
                    `${row.original.criticity}:${getCriticityColor(row.original.criticity)}`,
                );
            },
        },
        {
            accessorKey: "status",
            header: "Statut",
        },
        {
            accessorKey: "deadline",
            header: "Echéance (en mois)",
        },
        {
            accessorKey: "justification",
            header: "Justification",
        },
    ];

    function getCriticityColor(criticity: string): string {
        if (criticity === "Importante") {
            return "text-red-500";
        } else if (criticity === "Mineure") {
            return "text-green-500";
        } else {
            return "text-blue-500";
        }
    }

    function redirectToHomePage() {
        goto("/", { replaceState: false });
    }

    function handleDeleteEvent() {
        showDeleteProjectModal = true;
    }

    async function handleProjectDeletedEvent() {
        goto("/", { replaceState: false, invalidateAll: true });
        showDeleteProjectModal = false;
    }

    function handleUploadEvent() {
        const fileInput = document.getElementById(
            "fileInput",
        ) as HTMLInputElement;
        fileInput.accept = ".xlsx, .xls";
        fileInput.click();

        fileInput?.addEventListener("change", function () {
            if (fileInput.files !== null && fileInput.files.length > 0) {
                uploadFile = fileInput.files[0];
                showUpdateProjectModal = true;
            }
        });
    }
</script>

<div class="flex flex-row justify-between mb-8">
    {#await data.project}
        <Skeleton class="w-full h-[40px]" />
    {:then project}
        <div class="flex flex-row items-center">
            <Button onclick={redirectToHomePage} variant="outline" size="icon">
                <ChevronLeft />
            </Button>
            <h1 class="ml-4 font-bold text-2xl">{project.name}</h1>
        </div>
        <div id="buttons-container">
            <Button onclick={handleUploadEvent}>
                <Upload />
                Mettre à jour
            </Button>
            <Button onclick={handleDeleteEvent} variant="destructive">
                <Trash />
                Supprimer
            </Button>
        </div>
        <DeleteProjectModal
            bind:showModal={showDeleteProjectModal}
            project={project as Project}
            onDelete={handleProjectDeletedEvent}
        />
        <UpdateProjectModal
            project={project as Project}
            updateFile={uploadFile}
            bind:showModal={showUpdateProjectModal}
        />
        <input type="file" id="fileInput" class="hidden" />
    {/await}
</div>

{#await data.vulnerabilities}
    <Skeleton class="h-[300px]" />
{:then vulnerabilities}
    <DataTable
        data={vulnerabilities.map((item) => Vulnerability.parse(item))}
        columns={COLUMNS_DEF}
    />
{/await}
