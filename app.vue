<script setup lang="ts">
import { UserContextProvider } from "@nuxtbase/auth-ui-vue";
import { Toaster } from "vue-sonner";

const supabaseClient = useSupabaseClient();
</script>
<template>
  <UserContextProvider :supabaseClient="supabaseClient">
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
      <ClientOnly>
        <Toaster
          position="bottom-right"
          :rich-colors="true"
          :close-button="true"
        />
      </ClientOnly>
    </NuxtLayout>
  </UserContextProvider>
</template>
