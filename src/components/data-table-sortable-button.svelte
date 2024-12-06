<script lang="ts">
    import type { ComponentProps } from "svelte";
    import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
    import { Button } from "$lib/components/ui/button/index.js";

    interface DataTableSortableButtonProps extends ComponentProps<typeof Button> {
        label: string
    }
   
    let { variant = "ghost", label, ...restProps }: DataTableSortableButtonProps =
      $props();
  </script>
   
  <Button {variant} {...restProps}>
    <span>{label}</span>
    <ArrowUpDown class="ml-2 size-4" />
  </Button>