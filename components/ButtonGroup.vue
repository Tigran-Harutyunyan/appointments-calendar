<script setup lang="ts">
import { cn } from "@/lib/utils";

interface ButtonGroupProps {
  className?: string;
  activeIndex: number;
  items: {
    id: string;
    text: string;
  }[];
}
defineProps<ButtonGroupProps>();
const emit = defineEmits(["select"]);
</script>

<template>
  <div :class="cn('flex w-full', className)">
    <Button
      v-for="(item, index) in items"
      @click="emit('select', item.id)"
      type="button"
      :class="
        cn(
          'w-full',
          index !== 0 && 'border-l-0 rounded-l-none',
          index < items.length - 1 && 'rounded-r-none'
        )
      "
      :variant="activeIndex === index ? 'secondary' : 'outline'"
    >
      {{ item.text }}
    </Button>
  </div>
</template>
