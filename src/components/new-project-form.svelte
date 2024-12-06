<script lang="ts">
    import type { EventHandler } from "svelte/elements";
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Alert from "$lib/components/ui/alert";
    import CircleAlert from "lucide-svelte/icons/circle-alert";
    import Check from "lucide-svelte/icons/check";
    import z from "zod";
    import { invalidateAll } from "$app/navigation";

    interface FormProps {
        onSucces?: () => void;
    }

    const { onSucces }: FormProps = $props();

    let name = $state("");
    let isLoading = $state(false);
    let errMessage = $state("");
    let success = $state(false);

    const nameSchema = z
        .string()
        .min(2, "Le nom doit contenir au moins deux caractères")
        .max(20, "Le nom ne doit pas dépasser 20 caractères")
        .regex(
            /^[a-zA-Z\s-']+$/,
            "Le nom ne peut contenir que des lettres, des espaces, des apostrophes ou encore un tiret du 6.",
        )
        .transform((val) => val.trim());

    const handleOnSubmit: EventHandler = async (e) => {
        e.preventDefault();
        errMessage = "";
        success = false;

        try {
            // Validate using Zod
            const validatedName = nameSchema.parse(name);

            // Show loading state
            isLoading = true;

            // Simulate API call
            const formData = new FormData();
            formData.append("project", validatedName);
            await fetch("/projects", { method: "POST", body: formData });

            // Success!
            success = true;
            name = "";
            invalidateAll();

            setTimeout(() => {
                success = false;

                if (onSucces) {
                    onSucces();
                }
            }, 1000);
        } catch (err) {
            // Handle Zod validation errors
            if (err instanceof z.ZodError) {
                errMessage = err.errors[0].message;
            } else {
                console.error(err);
                errMessage =
                    "Une erreur est survenue lors de l'ajout du projet!";
            }
        } finally {
            isLoading = false;
        }
    };
</script>

<form onsubmit={handleOnSubmit}>
    <Label for="name">Nom du projet</Label>
    <Input
        type="text"
        id="name"
        disabled={isLoading}
        placeholder="Entrez le nom du projet"
        class={`w-full ${errMessage !== "" ? "border-red-500" : ""} focus:border-none`}
        bind:value={name}
    />

    <Button type="submit" disabled={isLoading} class="w-full mt-4">
        {isLoading ? "Ajout en cours..." : "Ajouter"}
    </Button>

    {#if errMessage !== ""}
        <Alert.Root variant="destructive" class="mt-2">
            <CircleAlert class="size-4" />
            <Alert.Title>Erreur</Alert.Title>
            <Alert.Description>{errMessage}</Alert.Description>
        </Alert.Root>
    {/if}
    {#if success}
        <Alert.Root
            variant="default"
            class="border-green-500 text-green-500 mt-2"
        >
            <Check class="size-4 text-green-500" color="#22c55e" />
            <Alert.Title>Succès</Alert.Title>
            <Alert.Description>Le projet a bien été rajouté !</Alert.Description
            >
        </Alert.Root>
    {/if}
</form>
