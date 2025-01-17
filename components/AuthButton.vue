<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-vue-next";

interface AuthButtonProps {
  pending?: boolean;
}
defineProps<AuthButtonProps>();
</script>

<template>
  <Button v-if="pending" variant="outline" class="w-full" disabled>
    <Loader2 class="size-4 mr-2 animate-spin" /> Please wait
  </Button>

  <Button v-else variant="outline" class="w-full">
    <slot name="icon" />
    <slot />
  </Button>
</template>
