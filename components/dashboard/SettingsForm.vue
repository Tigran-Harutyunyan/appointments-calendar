<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-vue-next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, configure } from "vee-validate";
import { aboutSettingsSchema } from "@/lib/zodSchemas";
import SubmitButton from "@/components/SubmitButton.vue";
import { toast } from "vue-sonner";
import { inject } from "vue";

const { updateProfile } = inject("profile");

interface SettingsFormProps {
  fullName: string;
  email: string;
  profileImage: string;
}

configure({
  validateOnBlur: false,
});

const props = defineProps<SettingsFormProps>();

const currentProfileImage = ref(props.profileImage);
const isPending = ref(false);

const { validate, values, setFieldValue } = useForm({
  initialValues: {
    fullName: props.fullName || "",
    profileImage: props.profileImage || "",
  },
  validationSchema: aboutSettingsSchema,
});

const onSubmit = async () => {
  if (!validate()) return;

  isPending.value = true;

  try {
    const user = await $fetch("/api/profile", {
      method: "POST",
      body: {
        payload: {
          fullName: values.fullName,
          profileImage: currentProfileImage.value,
        },
      },
    });

    if (user && "id" in user) {
      toast.success("Profile updated");
      updateProfile();
    }
  } catch (error) {
    toast.error("Profile updated error");
  } finally {
    isPending.value = false;
  }
};

const handleDeleteImage = () => {
  currentProfileImage.value = "";
  setFieldValue("profileImage", "");
};

const handleFileUpload = (file) => {
  currentProfileImage.value = file[0]?.appUrl;
  toast.success("Profile image uploaded");
};

const handleUploadError = () => {
  toast.error("Upload error occured");
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Settings</CardTitle>
      <CardDescription>Manage your account settings.</CardDescription>
    </CardHeader>
    <form no-validate @submit.prevent="onSubmit">
      <CardContent class="flex flex-col gap-y-4">
        <div class="flex flex-col gap-y-2">
          <FormField name="fullName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="text"
                  placeholder="John Doe"
                  :defaultValue="fullName"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex flex-col gap-y-2">
          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder="user email"
                  :defaultValue="email"
                />
              </FormControl>
            </FormItem>
          </FormField>
        </div>

        <div class="grid gap-y-5">
          <FormField name="profileImage" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <div v-if="currentProfileImage" class="relative size-16">
                  <img
                    :src="currentProfileImage"
                    alt="Profile"
                    :width="300"
                    :height="300"
                    class="rounded-lg size-16"
                  />
                  <Button
                    type="button"
                    @click="handleDeleteImage"
                    variant="destructive"
                    size="icon"
                    class="absolute -top-2 -right-2 w-6 h-6"
                  >
                    <X class="size-3" />
                  </Button>
                </div>
                <UploadDropzone
                  v-else
                  class="mr-auto"
                  :config="{
                    endpoint: 'e2',
                    appearance: {
                      container: 'border-muted',
                    },
                    onClientUploadComplete: (file) => handleFileUpload(file),
                    onUploadError: (error) => handleUploadError(error),
                  }"
                />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton text="Save Changes" :pending="isPending" />
      </CardFooter>
    </form>
  </Card>
</template>
