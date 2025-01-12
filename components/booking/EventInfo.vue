<script setup lang="ts">
import { type EventType } from "@/types";
import { BookMarked, CalendarX2, Clock } from "lucide-vue-next";

interface eventInfoProps {
  eventType: EventType | null;
  formattedDate: string;
}

defineProps<eventInfoProps>();
</script>

<template>
  <div>
    <NuxtImg
      :src="eventType?.user.image as string"
      :alt="`${eventType?.user.name}'s profile picture`"
      class="size-9 rounded-full"
      :width="30"
      :height="30"
    />
    <p class="text-sm font-medium text-muted-foreground mt-1">
      {{ eventType?.user?.name }}
    </p>
    <h1 class="text-xl font-semibold mt-2">{{ eventType?.title }}</h1>
    <p class="text-sm font-medium text-muted-foreground">
      {{ eventType?.description }}
    </p>

    <div class="mt-5 grid gap-y-3">
      <p class="flex items-center">
        <CalendarX2 class="size-4 mr-2 text-primary" />
        <span class="text-sm font-medium text-muted-foreground">
          {{ formattedDate }}
        </span>
      </p>
      <p class="flex items-center">
        <Clock class="size-4 mr-2 text-primary" />
        <span class="text-sm font-medium text-muted-foreground">
          {{ eventType?.duration }} Mins
        </span>
      </p>
      <p class="flex items-center">
        <BookMarked class="size-4 mr-2 text-primary" />
        <span class="text-sm font-medium text-muted-foreground">
          {{ eventType?.videoCallSoftware }}
        </span>
      </p>
    </div>
  </div>
</template>
