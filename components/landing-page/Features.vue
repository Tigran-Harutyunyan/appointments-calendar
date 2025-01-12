<script setup lang="ts">
import { features } from "@/data/features";
</script>

<template>
  <div class="py-24">
    <div class="max-w-2xl mx-auto lg:text-center">
      <p class="font-semibold leading-7 text-primary">Schedule faster</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Schedule meetings in minutes
      </h1>
      <p class="mt-6 text-base leading-snug text-muted-foreground">
        With Scheduler you can schedule meetings in minutes. We make it easy for
        you to schedule meetings in minutes. The meetings are very fast and easy
        to schedule.
      </p>
    </div>

    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <div
        class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
      >
        <div
          v-for="feature in features"
          :key="feature.name"
          class="relative pl-16"
        >
          <div class="text-base font-semibold leading-7">
            <div
              class="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary"
            >
              <component :is="feature.icon" class="w-6 h-6 text-white" />
            </div>
            {{ feature.name }}
          </div>
          <p class="mt-2 text-sm text-muted-foreground leading-snug">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
