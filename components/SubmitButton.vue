<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-vue-next";

interface SubmitButtonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;

  className?: string;
  pending?: boolean;
  type?: "submit" | "button";
}

withDefaults(defineProps<SubmitButtonProps>(), {
  type: "submit",
});
</script>

<template>
  <Button
    v-if="pending"
    disabled
    variant="outline"
    :class="cn('w-fit', className)"
    :type="type"
  >
    <Loader2 class="size-4 mr-2 animate-spin" /> Please wait
  </Button>

  <Button
    v-else
    :variant="variant"
    type="submit"
    :class="cn('w-fit', className)"
  >
    {{ text }}
  </Button>
</template>
