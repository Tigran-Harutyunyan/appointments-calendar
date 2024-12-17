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

const { data } = useFetch<ScheduleItem[]>("/api/availability");
const isPending = ref(false);
const localAvailability = ref<ScheduleItem[]>();

const TIME_KEYS = {
  FROM_TIME: "fromTime",
  TILL_TIME: "tillTime",
};

type TimeKey = (typeof TIME_KEYS)[keyof typeof TIME_KEYS];

const updateAvailabilityAction = async () => {
  if (!localAvailability.value) return;
  isPending.value = true;

  const availabilityData = localAvailability.value.map((item) => {
    const { id, isActive, fromTime, tillTime } = item;
    return {
      id,
      isActive,
      fromTime,
      tillTime,
    };
  });

  try {
    const response = await $fetch("/api/availability", {
      method: "POST",
      body: {
        availabilityData,
      },
    });
    if (response && "status" in response && response.status === "success") {
      toast.success("Availbility is updated");
    }
  } catch (error) {
    toast.error("Error updateing availbility");
  } finally {
    isPending.value = false;
  }
};

const initLocalAvailability = () => {
  if (!localAvailability.value && data.value) {
    localAvailability.value = [...data.value];
  }
};

const handleDayUpdate = (id: string, isActive: boolean) => {
  initLocalAvailability();

  const filtered = localAvailability.value?.find((item) => item.id === id);
  if (filtered && "isActive" in filtered) filtered.isActive = isActive;
};

const handleTimeChange = (id: string, key: TimeKey, time: string) => {
  initLocalAvailability();

  const filtered = localAvailability.value?.find((item) => item.id === id);

  if (!filtered) throw new Error("Soemthing went wrong");

  if (key === TIME_KEYS.FROM_TIME && TIME_KEYS.FROM_TIME in filtered)
    filtered.fromTime = time;

  if (key === TIME_KEYS.TILL_TIME && TIME_KEYS.TILL_TIME in filtered)
    filtered.tillTime = time;
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Availability</CardTitle>
      <CardDescription>
        In this section you can manage your availability.
      </CardDescription>
    </CardHeader>
    <form @submit.prevent="updateAvailabilityAction" v-if="data">
      <CardContent class="flex flex-col gap-y-4">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
          v-for="item in data"
          :key="item.id"
        >
          <div class="flex items-center gap-x-3">
            <Switch
              :defaultChecked="item.isActive"
              @update:checked="(isActive) => handleDayUpdate(item.id, isActive)"
            />
            <p>{{ item.day }}</p>
          </div>
          <Select
            :defaultValue="item.fromTime"
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
            :name="`tillTime-${item.id}`"
            :defaultValue="item.tillTime"
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
