<script setup lang="ts">
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-vue-next";
import { toast } from "vue-sonner";

interface CopyLinkMenuItemProps {
  meetingUrl: string;
}

const props = defineProps<CopyLinkMenuItemProps>();

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.meetingUrl);
    toast.success("URL copied to clipboard");
  } catch (err) {
    toast.error("Failed to copy URL");
  }
};
</script>

<template>
  <DropdownMenuItem @select="handleCopy">
    <Link2 class="mr-2 h-4 w-4" />
    <span>Copy</span>
  </DropdownMenuItem>
</template>
