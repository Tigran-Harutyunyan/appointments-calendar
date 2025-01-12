<script setup lang="ts">
import Hero from "@/components/landing-page/Hero.vue";
import Logos from "@/components/landing-page/Logos.vue";
import Features from "@/components/landing-page/Features.vue";
import Testimonial from "@/components/landing-page/Testimonial.vue";
import CTA from "@/components/landing-page/CTA.vue";
import Navbar from "@/components/landing-page/Navbar.vue";

definePageMeta({
  middleware: ["auth"],
});
</script>
<template>
  <NuxtLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Hero />
      <Logos />
      <Features />
      <Testimonial />
      <CTA />
    </div>
  </NuxtLayout>
</template>
