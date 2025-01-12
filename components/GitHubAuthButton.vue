<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-vue-next";

const pending = false;
</script>

<template>
  <Button v-if="pending" variant="outline" class="w-full" disabled>
    <Loader2 class="size-4 mr-2 animate-spin" /> Please wait
  </Button>

  <Button variant="outline" class="w-full">
    <NuxtImg
      src="/github.svg"
      class="size-4 mr-2 dark:invert"
      alt="Google Logo"
    />
    Sign in with GitHub
  </Button>
</template>
