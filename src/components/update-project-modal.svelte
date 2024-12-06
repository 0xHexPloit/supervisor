<script lang="ts">
    import type { Project } from "../schema/project";
    import Loader from "lucide-svelte/icons/loader-circle";
    import Modal from "./modal.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Retry from "lucide-svelte/icons/refresh-ccw";
    import { XCircle } from "lucide-svelte";

    interface DeleteProjectModalProps {
        project: Project;
        updateFile?: File;
        showModal: boolean;
        onProjectUpdated?: () => void;
    }

    let {
        project,
        updateFile,
        onProjectUpdated,
        showModal = $bindable(),
    }: DeleteProjectModalProps = $props();
    let updatingInProgress = $state(true);
    let errMessage = $state("");

    function handleCancelEvent() {
        showModal = false;
    }

    async function handleUpdateEvent() {
        updatingInProgress = true;
        errMessage = "";

        await new Promise((res) => setTimeout(res, 1000));

        try {
            const formData = new FormData();
            formData.append("file", updateFile as Blob);

            await fetch(`/projects/${project.id.split(":")[1]}`, {
                method: "PATCH",
                body: formData,
            });
            if (onProjectUpdated) {
                onProjectUpdated();
            }
        } catch (err) {
            errMessage = `${err}`;
        } finally {
            updatingInProgress = false;
        }
    }

    $effect(() => {
        if (showModal) {
            handleUpdateEvent();
        }
    });
</script>

<Modal bind:showModal>
    <div class="p-4 flex flex-col items-center">
        {#if updatingInProgress}
            <Loader class="h-8 w-8 animate-spin" />
            <h1 class="my-4 text-medium font-bold">
                Mise à jour du projet {project.name} en cours...
            </h1>
            <p class="text-gray-500">
                Veuillez patienter pendant que nous traitons votre demande
            </p>
        {:else}
            <div
                class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"
            >
                <XCircle className="h-8 w-8" color="#f56565" />
            </div>
            <h2 class="my-4 text-xl font-semibold text-center">
                Échec de la mise à jour
            </h2>
            <p
                class="mb-2 text-red-600 text-center bg-red-50 p-4 rounded-md w-full"
            >
                Une erreur est survenue lors de la mise à jour du projet: {errMessage}
            </p>
            <div class="flex gap-4 mt-4">
                <Button
                    variant="outline"
                    onclick={handleCancelEvent}
                    class="w-full"
                >
                    Cancel
                </Button>
                <Button onclick={handleUpdateEvent} class="w-full">
                    <Retry className="w-4 h-4 mr-2" />
                    Retry Update
                </Button>
            </div>
        {/if}
    </div>
</Modal>
