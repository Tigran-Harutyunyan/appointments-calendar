<script setup lang="ts">
import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { type NylasResponse, type GetFreeBusyResponse } from "nylas";

interface TimeSlotsProps {
  selectedDate: Date;
  userName: string;
  meetingDuration: number;
}

const props = defineProps<TimeSlotsProps>();
const emit = defineEmits(["select"]);

const data = ref();
const isLoading = ref(true);
const dateFormat = "yyyy-MM-dd";
const timeFormat = "yyyy-MM-dd HH:mm";

// Format the selected date to 'yyyy-MM-dd'
const formattedDate = format(
  typeof props.selectedDate === "string"
    ? new Date(props.selectedDate)
    : props.selectedDate,
  dateFormat
);
/**
 * Calculates available time slots based on DB availability and busy slots from Nylas calendar.
 */
const calculateAvailableTimeSlots = (
  dbAvailability: {
    fromTime: string | undefined;
    tillTime: string | undefined;
  },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
  date: string,
  duration: number
) => {
  const now = new Date(); // Get the current time

  // Convert database availability to Date objects
  const availableFrom = parse(
    `${date} ${dbAvailability.fromTime}`,
    timeFormat,
    new Date()
  );
  const availableTill = parse(
    `${date} ${dbAvailability.tillTime}`,
    timeFormat,
    new Date()
  );

  // Extract busy slots from Nylas data
  const busySlots = nylasData.data[0]?.timeSlots.map((slot: any) => ({
    start: fromUnixTime(slot.startTime),
    end: fromUnixTime(slot.endTime),
  }));

  // Generate all possible 30-minute slots within the available time
  const allSlots = [];
  let currentSlot = availableFrom;
  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, duration);
  }

  // Filter out busy slots and slots before the current time
  const freeSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);
    return (
      isAfter(slot, now) &&
      !busySlots.some(
        (busy: { start: any; end: any }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
      )
    );
  });

  // Format the free slots into HH:mm string
  return freeSlots.map((slot) => format(slot, "HH:mm"));
};

// Calculate available time slots based on the current availability and busy slots
const availableSlots = ref();

const fetchData = async () => {
  // Fetch data from the calendar API
  const response = await $fetch(
    `/api/calendar?username=${props.userName}&selectedDate=${props.selectedDate}`
  );
  data.value = response?.data;
  const nylasCalendarData = response?.nylasCalendarData;

  const dbAvailability = {
    fromTime: data.value?.fromTime,
    tillTime: data.value?.tillTime,
  };

  availableSlots.value = calculateAvailableTimeSlots(
    dbAvailability,
    nylasCalendarData,
    formattedDate,
    props.meetingDuration
  );

  isLoading.value = false;
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="flex items-center justify-center relative">
    <Loader v-if="isLoading" />
    <div v-else>
      <p class="text-base font-semibold">
        {{ format(selectedDate, "EEE") }}.
        <span class="text-sm text-muted-foreground">
          {{ format(selectedDate, "MMM. d") }}
        </span>
      </p>

      <div class="mt-3 max-h-[260px] overflow-y-auto">
        <template v-if="availableSlots?.length > 0">
          <Button
            v-for="(slot, index) in availableSlots"
            :key="index"
            @click="emit('select', slot)"
            variant="outline"
            class="w-full mb-2"
          >
            {{ slot }}
          </Button>
        </template>
        <p v-else>No available time slots for this date.</p>
      </div>
    </div>
  </div>
</template>
