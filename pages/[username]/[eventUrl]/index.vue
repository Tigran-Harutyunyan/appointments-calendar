<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
useHead({
  title: "Scheduler | Event types",
});

import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EventInfo from "@/components/booking/EventInfo.vue";
import EventForm from "@/components/booking/EventForm.vue";
import RenderCalendar from "@/components/calendar/RenderCalendar.vue";
import TimeSlots from "@/components/calendar/TimeSlots.vue";
import { type EventType } from "@/types";
import { toast } from "vue-sonner";

const isPending = ref(false);
const route = useRoute();
const query = route.query;
const trigger = ref(0); // used for triggering Timeslots rerender.

const date = ref(query?.date ? new Date(query?.date as string) : new Date());
const time = ref("");
const showForm = ref(false);
const { username, eventUrl } = useRoute().params;

const { data: eventType, status } = await useFetch<EventType>(
  `/api/event/${eventUrl}?username=${username}`
);

if (!eventType.value) {
  navigateTo("/dashboard");
}

const formattedDate = computed(() =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date.value)
);

const rearrangedAvailability = computed(() => {
  const availability = eventType.value?.user?.Availability;

  if (!availability) {
    return [];
  }

  // Create a shallow copy of the availability array
  const arr = [...availability];

  if (arr.length === 0) {
    return arr;
  }

  // Move the last element to the front
  const lastElement = arr.pop();

  if (lastElement !== undefined) {
    arr.unshift(lastElement);
  }

  return arr;
});

const onSubmit = async (formData: { email: string; name: string }) => {
  const payload = {
    fromTime: time.value,
    eventDate: format(date.value, "yyyy-MM-dd"),
    meetingLength: eventType?.value?.duration,
    eventTypeId: eventType?.value?.id,
    username,
    name: formData.name,
    email: formData.email,
  };
  isPending.value = true;

  try {
    const response = await $fetch("/api/meeting/create", {
      method: "POST",
      body: {
        payload,
      },
    });

    if (response && "requestId" in response) {
      navigateTo("/dashboard/success");
    }
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  } finally {
    isPending.value = false;
  }
};

const onDateSelect = (newDate: Date) => {
  date.value = newDate;
  ++trigger.value;
};

const onTimeSelect = (timeSlot: string) => {
  time.value = timeSlot;
  showForm.value = true;
};
</script>

<template>
  <div class="flex items-center justify-center mx-4 max-w-[740px]">
    <Loader v-if="status === 'pending'" />
    <template v-else>
      <Card v-show="showForm" class="max-w-[600px] w-full">
        <CardContent
          v-if="showForm"
          class="p-5 grid md:grid-cols-[1fr,auto,1fr] gap-4"
        >
          <EventInfo :formatted-date="formattedDate" :event-type="eventType" />
          <Separator
            orientation="vertical"
            class="hidden md:block h-full w-[1px]"
          />
          <EventForm
            :pending="isPending"
            @submit="onSubmit"
            @cancel="showForm = false"
          />
        </CardContent>
      </Card>

      <Card v-show="!showForm" class="w-full max-w-[1000px] mx-auto">
        <CardContent
          v-if="eventType"
          class="p-5 md:grid md:grid-cols-[2fr,auto,3fr,auto,1fr] md:gap-4"
        >
          <EventInfo :formatted-date="formattedDate" :event-type="eventType" />

          <Separator
            orientation="vertical"
            class="hidden md:block h-full w-[1px]"
          />

          <div class="my-4 md:my-0">
            <RenderCalendar
              :daysofWeek="rearrangedAvailability"
              @date-change="onDateSelect"
            />
          </div>

          <Separator
            orientation="vertical"
            class="hidden md:block h-full w-[1px]"
          />

          <TimeSlots
            v-if="date"
            :key="trigger"
            :selected-date="date"
            :user-name="String(username)"
            :meeting-duration="eventType?.duration"
            @select="onTimeSelect"
          />
        </CardContent>
      </Card>
    </template>
  </div>
</template>
