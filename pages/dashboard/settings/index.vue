<script setup lang="ts">
import SettingsForm from "@/components/dashboard/SettingsForm.vue";
definePageMeta({ layout: "dashboard" });
useHead({
  title: "Scheduler | Settings",
});

type profileType = {
  email: string;
  name: string;
  image: string;
};

const { data } = useFetch<profileType>("/api/profile");
</script>

<template>
  <SettingsForm
    v-if="data"
    :email="data?.email"
    :fullName="data?.name"
    :profileImage="data?.image || ''"
    class="md:max-w-lg"
  />
  <Loader v-else />
</template>
