<script setup lang="ts">
import { toast } from "vue-sonner";
import { type EventPayloadType } from "@/types";
const isPending = ref(false);
const route = useRoute();

definePageMeta({ layout: "dashboard" });

type EventType = {
  id: string;
  title: string;
  description: string;
  duration: number;
  url: string;
  videoCallSoftware: string;
};

const { data: event, status } = useFetch<EventType>(
  `/api/events/${route.params.eventTypeId}`
);

const onSubmit = async (values: EventPayloadType) => {
  isPending.value = true;

  try {
    const response = await $fetch(`/api/events/${route.params.eventTypeId}`, {
      method: "PUT",
      body: {
        payload: values,
      },
    });

    if (response && "id" in response) {
      toast.success("Event updated");
      navigateTo("/dashboard");
    }

    const responseError =
      response && "error" in response ? response.error : null;

    if (responseError) {
      const errorMessage = Object.values(responseError).join(",");
      toast.error(errorMessage);
    }
  } catch (error) {
    toast.error(error);
  } finally {
    isPending.value = false;
  }
};
</script>

<template>
  <DashboardEditEventTypeForm
    v-if="event && status === 'success'"
    :id="event.id"
    :title="event.title"
    :description="event.description"
    :duration="String(event.duration)"
    :callProvider="event.videoCallSoftware"
    :url="event.url"
    :is-pending="isPending"
    @submit="onSubmit"
  />
  <Loader v-if="status === 'pending'" />
</template>
