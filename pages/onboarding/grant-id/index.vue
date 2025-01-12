<script setup lang="ts">
useHead({
  title: "Scheduler | Onboarding",
});
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck2 } from "lucide-vue-next";
import { toast } from "vue-sonner";

const client = useSupabaseClient();

const redirectMe = async () => {
  const authUrl = await $fetch("/api/auth/nylas");

  if (authUrl && typeof authUrl === "string") {
    location.href = authUrl as string;
  }
};

const logout = async () => {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw new Error(error.message);
    navigateTo("/");
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  }
};
</script>

<template>
  <div class="min-h-screen w-screen flex items-center justify-center">
    <Card>
      <CardHeader>
        <CardTitle>You Are Almost Done!</CardTitle>
        <CardDescription>
          We have to now connect your calendar to your account.
        </CardDescription>
        <img
          src="/public/work-is-almost-over-happy.gif"
          alt="Almost Finished"
          class="w-full rounded-lg"
        />
      </CardHeader>
      <CardContent>
        <Button @click="redirectMe" as-child class="w-full cursor-pointer">
          <div>
            <CalendarCheck2 class="size-4 mr-2" />
            Connect Calender to Account
          </div>
        </Button>
        <Button @click="logout()" variant="secondary" class="mt-4 w-full">
          Logout
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
