<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
useHead({
  title: "Scheduler | Event types",
});
import { Button } from "@/components/ui/button";
import { ExternalLink, Pen, Settings, Trash, Users2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CopyLinkMenuItem from "@/components/dashboard/CopyLinkMenuItem.vue";
import EmptyState from "@/components/dashboard/EmptyState.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import MenuActiveSwitcher from "@/components/dashboard/EventTypeSwitcher.vue";

const appUrl = useRuntimeConfig().public.appUrl as string;
const confirm = useTemplateRef<InstanceType<typeof ConfirmDialog> | null>(
  "confirm-dialog"
);
const { data, refresh, status } = useFetch("/api/events");

const showConfirm = async (id: string) => {
  const ok = await confirm.value?.openModal(
    "Delete Event type",
    "Are you sure you want to delete this event type??"
  );

  if (!ok) return;

  try {
    const response = await $fetch(`/api/events/${id}/delete`, {
      method: "DELETE",
    });

    if (response && "id" in response) {
      toast.success("Event deleted");
      refresh();
    }
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  }
};
</script>

<template>
  <ConfirmDialog ref="confirm-dialog" />
  <Loader v-if="status === 'pending'" />
  <template v-else>
    <div class="flex items-center justify-between px-2 max-w-[1200px]">
      <div class="sm:grid gap-1 hidden">
        <h1 class="font-heading text-3xl md:text-4xl">Event Types</h1>
        <p class="text-lg text-muted-foreground">
          Create and manage your event types.
        </p>
      </div>
      <Button as-child>
        <NuxtLink to="/dashboard/new">Create New Event</NuxtLink>
      </Button>
    </div>
    <EmptyState
      v-if="data?.EventType.length === 0"
      title="You have no Event Types"
      description="You can create your first event type by clicking the button below."
      buttonText="Add Event Type"
      href="/dashboard/new"
      show-create
    />
    <div
      v-else
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-[1200px] mt-5"
    >
      <div
        v-for="item in data?.EventType"
        :key="item.id"
        class="overflow-hidden shadow rounded-lg border relative"
      >
        <div class="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="icon">
                <Settings class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-20" align="end">
              <DropdownMenuLabel>Event</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem as-child>
                  <NuxtLink :to="`/${data?.username}/${item.url}`">
                    <ExternalLink class="mr-2 h-4 w-4" />
                    <span>Preview</span>
                  </NuxtLink>
                </DropdownMenuItem>
                <CopyLinkMenuItem
                  :meetingUrl="`${appUrl}/${data?.username}/${item.url}`"
                />
                <DropdownMenuItem as-child>
                  <NuxtLink :to="`/dashboard/event/${item.id}`">
                    <Pen class="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child @select="showConfirm(item.id)">
                <div>
                  <Trash class="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <NuxtLink :to="`/dashboard/event/${item.id}`">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Users2 class="h-6 w-6" aria-hidden="true" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-lg font-medium truncate">
                    {{ item.duration }} Minutes Meeting
                  </dt>
                  <dd>
                    <div class="text-sm font-medium">
                      {{ item.title }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </NuxtLink>
        <div
          class="bg-muted dark:bg-gray-900 px-5 py-3 flex justify-between items-center"
        >
          <MenuActiveSwitcher
            :initial-checked="item.active"
            :event-type-id="item.id"
          />
          <NuxtLink :to="`/dashboard/event/${item.id}`">
            <Button class="">Edit Event</Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
</template>
