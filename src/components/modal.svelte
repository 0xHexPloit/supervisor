<script>
	let {
		showModal = $bindable(),
		displayCloseButton = false,
		children,
	} = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) {
			dialog.showModal()
		} else {
			dialog.close()
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog.close();
	}}
>
	<div class="min-w-96 relative">
		{#if displayCloseButton === true}
			<button
				onclick={() => dialog.close()}
				class="w-[15px] absolute top-2 right-2"
			>
				<img src="/close.svg" alt="close-button" />
			</button>
		{/if}
		{@render children()}
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.1);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
