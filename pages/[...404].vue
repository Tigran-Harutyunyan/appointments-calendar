<script setup>
import { Button } from "~/components/ui/button";

useHead({
  title: "Scheduler | 404",
});
</script>

<template>
  <div class="min-h-screen">
    <div
      class="w-full lmd:w-1/2 relative pb-12 lg:pb-0 flex items-center justify-center h-screen"
    >
      <div class="relative flex items-center flex-col space-y-8">
        <div class="mb-12 mx-auto">
          <img src="../assets/images/404.svg" class="mx-auto w-[300px]" />
        </div>
        <NuxtLink to="/" class="mx-auto">
          <Button>GO HOME</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
