<script setup lang="ts">
import { updateEventTypeStatusAction } from "@/app/actions";
import { Switch } from "@/components/ui/switch";
import { toast } from "vue-sonner";

interface MenuActiveSwitcherProps {
  eventTypeId: string;
  initialChecked: boolean;
}

const props = defineProps<MenuActiveSwitcherProps>();

const isPending = ref(false);

const onSwitch = async (isChecked: boolean) => {
  try {
    const response = await $fetch(`/api/events/${props.eventTypeId}/status`, {
      method: "POST",
      body: {
        isChecked,
      },
    });

    if (response && "id" in response) {
      toast.success("Status changed");
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
  <Switch
    :defaultChecked="initialChecked"
    :disabled="isPending"
    @update:checked="onSwitch"
  />
</template>
