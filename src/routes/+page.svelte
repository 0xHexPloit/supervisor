<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Avatar from "../components/avatar.svelte";
  import Modal from "../components/modal.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import NewProjectForm from "../components/new-project-form.svelte";
  const { data } = $props();

  let showModal = $state(false);

  function onProjectAdded() {
    showModal = false;
  }
</script>

<div class="flex flex-col items-end">
  <Button class="mb-4" onclick={() => (showModal = true)}>Nouveau projet</Button
  >
  <div class="w-full h-full grid grid-cols-5 gap-4 overflow-y-scroll">
    {#await data.projects}
      {#each new Array(4) as item}
        <Skeleton class="rounded-md  h-[180px]" />
      {/each}
    {:then projects}
      {#each projects as project}
        <a
          href={`/projects/${project.id.split(":")[1]}`}
          class="p-4 border-2 border-black-500 flex flex-col items-center rounded-md hover:cursor-pointer"
        >
          <Avatar name={project.name} />
          <p class="mt-4">{project.name}</p>
        </a>
      {/each}
    {/await}
  </div>
</div>
<Modal bind:showModal displayCloseButton>
  <NewProjectForm onSucces={onProjectAdded} />
</Modal>
