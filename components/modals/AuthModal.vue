<script setup lang="ts">
import GoogleAuthButton from "../GoogleAuthButton.vue";
import GitHubAuthButton from "../GitHubAuthButton.vue";
import { toast } from "vue-sonner";

const supabaseClient = useSupabaseClient();

const handleLogin = async (provider: "github" | "google") => {
  try {
    await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {},
    });
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  }
};
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>Try for Free</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[360px]">
      <DialogHeader class="flex-row justify-center items-center gap-x-2">
        <img src="/logo.png" class="size-10" alt="Logo" />
        <h4 class="text-3xl font-semibold">
          Cal<span class="text-primary">endar</span>
        </h4>
      </DialogHeader>
      <div class="flex flex-col gap-3 mt-5">
        <GoogleAuthButton @click="handleLogin('google')" />
        <GitHubAuthButton @click="handleLogin('github')" />
      </div>
    </DialogContent>
  </Dialog>
</template>
