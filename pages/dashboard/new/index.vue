<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref } from "vue";
import { toast } from "vue-sonner";
import { type EventPayloadType } from "@/types";

const isPending = ref(false);

const onSubmit = async (values: EventPayloadType) => {
  isPending.value = true;

  try {
    const response = await $fetch("/api/events/create", {
      method: "POST",
      body: {
        payload: values,
      },
    });

    if (response && "id" in response) {
      toast.success("Event created");
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
  <DashboardEditEventTypeForm @submit="onSubmit" :is-pending="isPending" />
</template>
