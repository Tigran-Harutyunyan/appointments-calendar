<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { useForm, configure } from "vee-validate";
import { createMeetingTypeSchema } from "@/lib/zodSchemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface EventFormProps {
  pending: boolean;
}

defineProps<EventFormProps>();
const emit = defineEmits(["submit", "cancel"]);

configure({
  validateOnBlur: false,
});

const form = useForm({
  initialValues: {
    name: "",
    email: "",
  },
  validationSchema: createMeetingTypeSchema,
});

configure({
  validateOnBlur: false,
});

const onSubmit = form.handleSubmit(async (values) => {
  if (!form.validate()) return;
  emit("submit", values);
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-y-4">
    <div class="flex flex-col gap-y-1">
      <FormField name="name" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Your Name</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="text"
              placeholder="Your Name"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="flex flex-col gap-y-1">
      <FormField name="email" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Your email</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="email"
              placeholder="johndoe@gmail.com"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <SubmitButton
      :disabled="pending"
      :pending="pending"
      text="Book Meeting"
      class="w-full mt-auto"
    />
    <Button variant="secondary" @click="emit('cancel')">Back</Button>
  </form>
</template>
