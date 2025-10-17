<script setup lang="ts">
import AuthButton from "../AuthButton.vue";
import { toast } from "vue-sonner";

const supabaseClient = useSupabaseClient();

const handleLogin = async (provider: "github" | "google") => {
  try {
    await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: process.env.NUXT_PUBLIC_APP_URL,
      },
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
          Sched<span class="text-primary">uler</span>
        </h4>
      </DialogHeader>
      <div class="flex flex-col gap-3 mt-5">
        <AuthButton @click="handleLogin('google')">
          <template #icon>
            <NuxtImg src="/google.svg" class="size-4 mr-2" alt="Google Logo" />
          </template>
          Sign in with Google
        </AuthButton>
        <AuthButton v-if="false" @click="handleLogin('github')">
          <template #icon>
            <NuxtImg
              src="/github.svg"
              class="size-4 mr-2 dark:invert"
              alt="Google Logo"
            />
          </template>
          Sign in with GitHub
        </AuthButton>
      </div>
    </DialogContent>
  </Dialog>
</template>
