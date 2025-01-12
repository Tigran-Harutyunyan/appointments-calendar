<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

import { ref, computed, onMounted } from "vue";
import { durations } from "@/lib/durations";
import { platforms } from "@/lib/platforms";
import { eventTypeSchema } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import ButtonGroup from "@/components/ButtonGroup.vue";
import SubmitButton from "@/components/SubmitButton.vue";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, configure } from "vee-validate";

configure({
  validateOnBlur: false,
});

interface EditEventTypeFormProps {
  id?: string;
  title?: string;
  url?: string;
  description?: string;
  duration?: string;
  callProvider?: string;
  isPending?: boolean;
}

type EmitType = {
  (
    event: "submit",
    value: Omit<EditEventTypeFormProps, "id" | "isPending">
  ): void;
};

const props = defineProps<Readonly<EditEventTypeFormProps>>();
const emit = defineEmits<EmitType>();

type ButtonId = (typeof platforms)[number]["id"];
const activePlatformId = ref<ButtonId>("google_meet");

const activePlatformIndex = computed(() => {
  return platforms.findIndex((item) => item.id === activePlatformId.value);
});

const togglePlatform = (buttonId: ButtonId) => {
  activePlatformId.value = buttonId;
  const selectedPlatform = platforms[activePlatformIndex.value]?.text || "";
  setFieldValue("videoCallSoftware", selectedPlatform);
};

const { validate, values, setFieldValue } = useForm({
  initialValues: {
    title: props.title || "",
    url: props.url || "",
    description: props.description || "",
    videoCallSoftware: props.callProvider || platforms[1].text,
  },
  validationSchema: eventTypeSchema,
});

const onSubmit = async () => {
  const isValid = await validate();
  if (!isValid) return;
  emit("submit", values);
};

onMounted(() => {
  if (props.callProvider) {
    const platform = platforms.find((item) => item.text === props.callProvider);
    if (platform) {
      activePlatformId.value = platform.id;
    }
  }

  if (props.duration) {
    setFieldValue("duration", props.duration);
  }
});
</script>

<template>
  <div class="w-full flex-1 flex flex-col md:max-w-lg">
    <Card>
      <CardHeader>
        <CardTitle
          >{{ id ? "Edit appointment type" : "Add new appointment type" }}
        </CardTitle>
        <CardDescription>
          {{
            id
              ? "Edit appointment type that allows people to book times."
              : "Create a new appointment type that allows people to book times."
          }}
        </CardDescription>
      </CardHeader>
      <form no-validate @submit.prevent="onSubmit()">
        <CardContent class="grid gap-y-5">
          <div class="flex flex-col gap-y-2">
            <FormField name="title" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="text"
                    placeholder="30 min meeting"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid gap-y-2">
            <FormField name="url" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>URL Slug</FormLabel>
                <FormControl>
                  <div class="flex rounded-md">
                    <span
                      class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm"
                    >
                      example.com/
                    </span>
                    <Input
                      type="text"
                      v-bind="componentField"
                      :disabled="id"
                      placeholder="example-user-1"
                      class="rounded-l-none"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid gap-y-2">
            <FormField name="description" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    type="text"
                    placeholder="Event description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid gap-y-2">
            <FormField name="duration" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select the duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Duration</SelectLabel>
                        <SelectItem
                          v-for="item in durations"
                          :value="String(item.duration)"
                          >{{ item.text }}</SelectItem
                        >
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid gap-y-2">
            <FormField name="videoCallSoftware" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Video Call Provider</FormLabel>
                <FormControl>
                  <ButtonGroup
                    class="w-full"
                    :active-index="activePlatformIndex"
                    :items="platforms"
                    @select="togglePlatform"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
        <CardFooter class="w-full flex justify-between">
          <Button as-child variant="secondary">
            <NuxtLink to="/dashboard">Cancel</NuxtLink>
          </Button>
          <SubmitButton
            :text="`${id ? 'Update' : 'Create'}`"
            :pending="isPending"
          />
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
