<script setup lang="ts">
import HeroIcon from "@/components/icons/HeroIcon.vue";
</script>

<template>
  <section class="relative flex items-center justify-center">
    <div class="relative items-center w-full py-12 lg:py-20">
      <div class="text-center">
        <span
          class="text-sm text-primary font-medium tracking-tight bg-primary/10 px-4 py-2 rounded-full"
        >
          Introducing Calendar 1.0
        </span>

        <h1
          class="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-none"
        >
          Scheduling made
          <span class="block text-primary">super easy!</span>
        </h1>

        <p class="max-w-xl mx-auto mt-4 lg:text-lg text-primblackary">
          Scheduling a meeting can be a pain. But we at Calendar make it easy
          for your clients to schedule meetings with you.
        </p>
      </div>

      <div class="relative items-center w-full py-12 mx-auto mt-12">
        <HeroIcon />
        <img
          src="/better.png"
          alt="Hero image"
          priority
          class="relative object-cover w-full border rounded-lg shadow-2xl lg:rounded-2xl"
        />
      </div>
    </div>
  </section>
</template>
