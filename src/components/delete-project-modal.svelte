<script lang="ts">
    import Modal from "./modal.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Alert from "$lib/components/ui/alert";
    import CircleAlert from "lucide-svelte/icons/circle-alert";
    import Loader from "lucide-svelte/icons/loader-circle";
    import type { Project } from "../schema/project";
    interface DeleteProjectModalProps {
        project: Project;
        showModal: boolean;
        onDelete?: () => void;
    }

    let {
        project,
        onDelete,
        showModal = $bindable(),
    }: DeleteProjectModalProps = $props();
    let deletionInProgress = $state(false);
    let errMessage = $state("");

    function handleCancelEvent() {
        showModal = false;
    }

    async function handleDeleteEvent() {
        deletionInProgress = true;
        errMessage = "";

        await new Promise((res) => setTimeout(res, 1000));

        try {
            await fetch(`/projects/${project.id.split(":")[1]}`, {
                method: "DELETE",
            });
            if (onDelete) {
                onDelete();
            }
        } catch (err) {
            errMessage = `${err}`;
        } finally {
            deletionInProgress = false;
        }
    }
</script>

<Modal bind:showModal>
    {#if deletionInProgress}
        <div class="p-4 flex flex-col items-center">
            <Loader class="h-8 w-8 animate-spin" />
            <h1 class="my-4 text-lg font-bold">
                Suppression du projet {project.name} en cours...
            </h1>
            <p class="text-gray-500">
                Veuillez patienter pendant que nous traitons votre demande
            </p>
        </div>
    {:else}
        <h1 class="font-bold text-2xl mb-2">Supprimer {project.name}?</h1>
        <p>
            Cette action ne peut être annulée. Cette action supprimera
            définitivement ce projet et toutes les données qui y sont associées.
        </p>
        {#if errMessage !== ""}
            <Alert.Root class="my-2" variant="destructive">
                <CircleAlert class="size-4" />
                <Alert.Title>Erreur</Alert.Title>
                <Alert.Description>{errMessage}</Alert.Description>
            </Alert.Root>
        {/if}
        <div class="buttons-container mt-4 flex flex-row justify-end">
            <Button
                onclick={handleCancelEvent}
                variant="outline"
                class="mr-2 focus:ring-0 ring-red">Annuler</Button
            >
            <Button onclick={handleDeleteEvent} variant="destructive"
                >Supprimer</Button
            >
        </div>
    {/if}
</Modal>
