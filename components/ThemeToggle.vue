<script setup lang="ts">
import { SunIcon } from "lucide-vue-next";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark({
  selector: "html",
  valueDark: "dark",
  valueLight: "light",
});

const toggleDark = useToggle(isDark);
</script>

<template>
  <SunIcon @click="toggleDark()" class="cursor-pointer" />
</template>
