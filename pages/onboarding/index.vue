<script setup lang="ts">
useHead({
  title: "Scheduler | Thank you",
});
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, configure } from "vee-validate";
import { onboardingSchemaLocale } from "@/lib/zodSchemas";
import SubmitButton from "@/components/SubmitButton.vue";

configure({
  validateOnBlur: false,
});

const { validate, values } = useForm({
  initialValues: {
    username: "",
    fullName: "",
  },
  validationSchema: onboardingSchemaLocale,
});

const onSubmit = async () => {
  if (!validate()) return;

  const response = await $fetch("/api/onboard", {
    method: "POST",
    body: {
      payload: {
        fullName: values.fullName,
        username: values.username,
      },
    },
  });
  if (response) {
    navigateTo("/onboarding/grant-id");
  }
};
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Scheduler</CardTitle>
        <CardDescription>
          We need the following information to set up your profile
        </CardDescription>
      </CardHeader>

      <form @submit.prevent="onSubmit">
        <CardContent class="flex flex-col gap-y-5">
          <FormField name="fullName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="text"
                  placeholder="John Doe"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="username" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <div class="flex rounded-md">
                <span
                  class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm"
                >
                </span>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="text"
                    placeholder="example-user-1"
                    class="rounded-l-none"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
        <CardFooter class="w-full">
          <SubmitButton className="w-full" text="Submit" />
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
