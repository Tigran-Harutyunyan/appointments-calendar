<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
useHead({
  title: "Scheduler | Meetings",
});
import { toast } from "vue-sonner";
import EmptyState from "@/components/dashboard/EmptyState.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-vue-next";
import { type meetingsResponse } from "@/types";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const confirm = useTemplateRef<InstanceType<typeof ConfirmDialog> | null>(
  "confirm-dialog"
);

const activeEventId = ref();
const isCanceling = ref(false);
const {
  data: meetings,
  status,
  refresh,
} = await useFetch<meetingsResponse>("/api/meetings");

const showConfirm = async (eventId: string) => {
  activeEventId.value = eventId;

  const ok = await confirm.value?.openModal(
    "Cancel meeting",
    "Are you sure you want to cancel this meeting?"
  );

  if (!ok) return;
  isCanceling.value = true;

  try {
    const response = await $fetch<{ requestId: string }>(
      `/api/meeting/${eventId}/cancel`,
      {
        method: "DELETE",
      }
    );

    if (response?.requestId) {
      toast.success("Meeting canceled");
      if (meetings?.data?.length === 1) {
        navigateTo("/dashboard/meetings");
      } else {
        refresh();
      }
    }
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  } finally {
    isCanceling.value = false;
  }
};
</script>

<template>
  <ConfirmDialog ref="confirm-dialog" />
  <Loader v-if="!meetings && status === 'pending'" />
  <EmptyState
    v-if="meetings?.data?.length === 0"
    title="No meetings found"
    description="You don't have any meetings yet."
    buttonText="Create a new event type"
    href="/dashboard/new"
  />

  <Card v-if="!!meetings?.data?.length" class="md:max-w-lg">
    <CardHeader>
      <CardTitle>Bookings</CardTitle>
      <CardDescription>
        See upcoming and past events booked through your event type links.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <template v-for="item in meetings?.data" :key="item.id">
        <div class="mobile:grid grid-cols-3 justify-between items-center">
          <div>
            <p class="text-muted-foreground text-sm">
              {{ format(fromUnixTime(item.when.startTime), "EEE, dd MMM") }}
            </p>
            <p class="text-muted-foreground text-xs pt-1">
              {{ format(fromUnixTime(item.when.startTime), "hh:mm a") }}
              {{ format(fromUnixTime(item.when.endTime), "hh:mm a") }}
            </p>
            <div class="flex items-center my-4 mobile:mt-1 mobile:mb-0">
              <Video class="size-4 mr-2 text-primary" />
              <a
                class="text-xs text-primary underline underline-offset-4"
                target="_blank"
                :href="item.conferencing.details.url"
              >
                Join Meeting
              </a>
            </div>
          </div>
          <div class="flex flex-col items-start">
            <h2 class="text-sm font-medium">{{ item.title }}</h2>
            <p class="text-sm text-muted-foreground">
              You {{ item.participants[0].name ? "and" : "" }}
              {{ item.participants[0].name }}
            </p>
          </div>
          <SubmitButton
            @click="showConfirm(item.id)"
            :pending="isCanceling && activeEventId === item.id"
            type="button"
            text="Cancel Event"
            variant="destructive"
            class="w-full sm-mobile:w-fit flex ml-auto mt-7 sm-mobile:mt-0"
          />
        </div>
        <Separator class="my-3" />
      </template>
    </CardContent>
  </Card>
</template>
