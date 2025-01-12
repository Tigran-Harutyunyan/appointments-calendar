<script setup lang="ts">
import { Calendar } from "@/components/ui/v-calendar";
import { format } from "date-fns";

interface RenderCalendarProps {
  daysofWeek: { day: string; isActive: boolean }[];
}

const props = defineProps<RenderCalendarProps>();
const emit = defineEmits(["dateChange"]);

const searchParams = useRoute().query;
const routeParams = useRoute().params;

const handleChangeDate = (newDate: Date) => {
  if (!newDate) return;

  const url = new URL(window.location.href);
  url.searchParams.set("date", newDate.toString());

  if (routeParams.username && routeParams.eventUrl) {
    const date = `${format(newDate, "MM-dd-yy")}`;
    navigateTo(`/${routeParams.username}/${routeParams.eventUrl}?date=${date}`);
  }
  emit("dateChange", newDate);
};

const getDate = () => {
  if (searchParams?.date) return new Date(searchParams?.date as string);
  return new Date();
};
const calendarDate = ref(getDate());

const disabledWeekDays = computed(() => {
  if (props.daysofWeek && Array.isArray(props.daysofWeek)) {
    return props.daysofWeek.reduce((acc: number[], item, index) => {
      if (!item.isActive) {
        acc.push(index + 1);
      }
      return acc;
    }, []);
  }
});
</script>

<template>
  <Calendar
    v-model="calendarDate"
    :min-date="new Date()"
    :disabled-dates="disabledWeekDays || []"
    @update:modelValue="handleChangeDate"
  />
</template>
