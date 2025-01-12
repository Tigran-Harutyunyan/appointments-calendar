<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

import { toast } from "vue-sonner";
import { times } from "@/lib/times";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type ScheduleItem } from "@/types";

const { data } = await useFetch<ScheduleItem[]>("/api/availability");
const isPending = ref(false);
const localAvailability = ref<ScheduleItem[]>(data.value ?? []);

const TIME_KEYS = {
  FROM_TIME: "fromTime",
  TILL_TIME: "tillTime",
} as const;

type TimeKey = (typeof TIME_KEYS)[keyof typeof TIME_KEYS];

const TOAST_MESSAGES = {
  SUCCESS: "Availability is updated successfully.",
  ERROR: "Failed to update availability. Please try again.",
};

const updateAvailability = async () => {
  if (!localAvailability.value) return;
  isPending.value = true;

  const availabilityData = localAvailability.value.map(
    ({ id, isActive, fromTime, tillTime }) => ({
      id,
      isActive,
      fromTime,
      tillTime,
    })
  );

  try {
    const response = await $fetch("/api/availability", {
      method: "POST",
      body: { availabilityData },
    });

    if (response?.status === "success") {
      toast.success(TOAST_MESSAGES.SUCCESS);
    } else {
      throw new Error();
    }
  } catch {
    toast.error(TOAST_MESSAGES.ERROR);
  } finally {
    isPending.value = false;
  }
};

const handleDayUpdate = (id: string, isActive: boolean) => {
  const item = localAvailability.value.find((item) => item.id === id);
  if (item) item.isActive = isActive;
};

const handleTimeChange = (id: string, key: TimeKey, time: string) => {
  const item = localAvailability.value.find((item) => item.id === id);
  if (!item) throw new Error("Could not find the schedule item.");

  item[key] = time;
};
</script>

<template>
  <Card v-if="data" class="md:max-w-lg">
    <CardHeader>
      <CardTitle>Availability</CardTitle>
      <CardDescription>
        In this section, you can manage your availability.
      </CardDescription>
    </CardHeader>
    <form @submit.prevent="updateAvailability">
      <CardContent class="flex flex-col gap-y-4">
        <div
          v-for="item in localAvailability"
          :key="item.id"
          class="grid grid-cols-2 mobile:grid-cols-4 items-center gap-4"
        >
          <div class="flex items-center gap-x-3 col-span-2">
            <Switch
              v-model:checked="item.isActive"
              @update:checked="(isActive) => handleDayUpdate(item.id, isActive)"
            />
            <p>{{ item.day }}</p>
          </div>
          <Select
            v-model="item.fromTime"
            @update:modelValue="
              (time) => handleTimeChange(item.id, TIME_KEYS.FROM_TIME, time)
            "
          >
            <SelectTrigger class="w-full">
              <SelectValue placeholder="From Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="time in times"
                  :key="time.id"
                  :value="time.time"
                >
                  {{ time.time }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            v-model="item.tillTime"
            @update:modelValue="
              (time) => handleTimeChange(item.id, TIME_KEYS.TILL_TIME, time)
            "
          >
            <SelectTrigger class="w-full">
              <SelectValue placeholder="To Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="time in times"
                  :key="time.id"
                  :value="time.time"
                >
                  {{ time.time }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton text="Save Changes" :pending="isPending" />
      </CardFooter>
    </form>
  </Card>
</template>
