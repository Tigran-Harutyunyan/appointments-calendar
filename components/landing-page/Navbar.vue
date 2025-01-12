<script setup lang="ts">
import AuthModal from "@/components/modals/AuthModal.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";
</script>

<template>
  <div
    class="relative flex flex-col w-full py-5 mx-auto md:flex-row md:items-center md:justify-between"
  >
    <div
      class="flex flex-row items-center justify-between text-sm lg:justify-start"
    >
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/logo.png" class="size-10" alt="Logo" />

        <h4 class="text-3xl font-semibold">
          Cal<span class="text-primary">endar</span>
        </h4>
      </NuxtLink>
      <div class="md:hidden">
        <ThemeToggle class="cursor-pointer" />
      </div>
    </div>

    <nav class="hidden md:flex md:justify-end items-center md:space-x-4">
      <ThemeToggle class="mr-2 cursor-pointer" />
      <AuthModal />
    </nav>
  </div>
</template>
