<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Ban, PlusCircle } from "lucide-vue-next";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  showCreate?: boolean;
}

defineProps<EmptyStateProps>();
</script>

<template>
  <div
    class="flex flex-col flex-1 h-full items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50"
  >
    <div
      class="flex size-20 items-center justify-center rounded-full bg-primary/10"
    >
      <Ban class="size-10 text-primary" />
    </div>
    <h2 class="mt-6 text-xl font-semibold">{{ title }}</h2>
    <p
      class="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground max-w-sm mx-auto"
    >
      {{ description }}
    </p>

    <Button v-if="showCreate" as-child>
      <NuxtLink :to="href">
        <PlusCircle class="mr-2 size-4" /> {{ buttonText }}
      </NuxtLink>
    </Button>
    <Button v-else as-child>
      <NuxtLink to="/dashboard">Go to events </NuxtLink>
    </Button>
  </div>
</template>
