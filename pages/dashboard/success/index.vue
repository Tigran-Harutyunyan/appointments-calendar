<script setup>
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-vue-next";
definePageMeta({ layout: "dashboard" });
useHead({
  title: "Scheduler | Thank you",
});
</script>

<template>
  <Card class="max-w-[400px] w-full mr-auto">
    <CardContent class="p-6 flex flex-col w-full items-center">
      <div
        class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
      >
        <Check class="w-8 h-8 text-green-500" />
      </div>
      <h1 class="text-2xl font-semibold mt-4">This event is scheduled</h1>
      <p class="text-sm text-muted-foreground text-center mt-1">
        We emailed you and the other attendees a calendar invitation with all
        the details.
      </p>
    </CardContent>
    <CardFooter>
      <Button class="w-full" as-child>
        <NuxtLink to="/dashboard/meetings">Go to meetings</NuxtLink>
      </Button>
    </CardFooter>
  </Card>
</template>
