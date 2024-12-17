<script setup lang="ts">
import { cn } from "@/lib/utils";
import { CalendarCheck, HomeIcon, Settings, Users2 } from "lucide-vue-next";

const dashboardLinks = [
  {
    id: 0,
    name: "Event Types",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Meetings",
    href: "/dashboard/meetings",
    icon: Users2,
  },
  {
    id: 2,
    name: "Availablity",
    href: "/dashboard/availability",
    icon: CalendarCheck,
  },
  {
    id: 3,
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const pathname = computed(() => useRoute().fullPath);
</script>

<template>
  <NuxtLink
    v-for="link in dashboardLinks"
    :key="link.id"
    :href="link.href"
    :class="
      cn(
        pathname === link.href
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:text-foreground',
        'flex items-center gap-3 rounded-lg px-3 py-2  transition-all  hover:text-primary'
      )
    "
  >
    <component :is="link.icon" class="h-4 w-4" />
    {{ link.name }}
  </NuxtLink>
</template>
