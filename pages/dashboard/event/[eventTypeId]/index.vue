<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
import { type EventPayloadType } from "@/types";

definePageMeta({ layout: "dashboard" });

const isPending = ref(false);
const route = useRoute();

interface EventType {
  id: string;
  title: string;
  description: string;
  duration: number;
  url: string;
  videoCallSoftware: string;
}

// Fetch event data
const { data: event, status } = useFetch<EventType>(
  `/api/events/${route.params.eventTypeId}`
);

// Handle form submission
const onSubmit = async (values: EventPayloadType) => {
  isPending.value = true;

  try {
    const response = await $fetch<
      EventType | { error: Record<string, string> }
    >(`/api/events/${route.params.eventTypeId}`, {
      method: "PUT",
      body: { payload: values },
    });

    if ("id" in response) {
      toast.success("Event updated successfully!");
    }

    if ("error" in response) {
      const errorMessage = Object.values(response.error).join(", ");
      toast.error(`Update failed: ${errorMessage}`);
    }
  } catch (error: unknown) {
    toast.error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  } finally {
    isPending.value = false;
  }
};
</script>

<template>
  <Loader v-if="status === 'pending'" />

  <DashboardEditEventTypeForm
    v-else-if="event && status === 'success'"
    :id="event.id"
    :title="event.title"
    :description="event.description"
    :duration="String(event.duration)"
    :callProvider="event.videoCallSoftware"
    :url="event.url"
    :is-pending="isPending"
    @submit="onSubmit"
  />

  <!-- Fallback for missing event data -->
  <p v-else class="text-muted">Event data could not be loaded.</p>
</template>
