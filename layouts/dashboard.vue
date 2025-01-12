<script setup lang="ts">
import { Menu } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DasboardLinks from "@/components/dashboard/DasboardLinks.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";
import { toast } from "vue-sonner";

const user = useSupabaseUser();
const client = useSupabaseClient();

type userType = {
  username: string;
  grantId: string;
  image: string;
};

const { data, refresh } = await useFetch<userType>("/api/auth/user");

if (!data?.value?.username) {
  navigateTo("/onboarding");
}

if (!data?.value?.grantId) {
  navigateTo("/onboarding/grant-id");
}

const showContent = computed(
  () => data?.value?.username && data?.value?.grantId
);

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

const updateProfile = () => {
  refresh();
};

provide("profile", {
  updateProfile,
});
</script>

<template>
  <div
    v-if="showContent"
    class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
  >
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
            <img src="/logo.png" alt="Logo" class="size-6" />
            <p class="text-xl font-bold">
              Scheduler<span class="text-primary"></span>
            </p>
          </NuxtLink>
        </div>
        <div class="flex-1">
          <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
            <DasboardLinks />
          </nav>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <header
        class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6"
      >
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="shrink-0 md:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="flex flex-col">
            <nav class="grid gap-2 mt-10">
              <DasboardLinks />
            </nav>
          </SheetContent>
        </Sheet>

        <div v-if="user?.id" class="ml-auto flex items-center gap-x-4">
          <ThemeToggle class="mr-2 cursor-pointer" />
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="secondary" size="icon" class="rounded-full">
                <img
                  alt="Profile"
                  :src="data?.image"
                  :width="20"
                  :height="20"
                  class="w-full h-full rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <NuxtLink to="/dashboard/settings">Settings</NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem as-child>
                <data class="w-full">
                  <button class="text-left" @click="logout()">Log out</button>
                </data>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
