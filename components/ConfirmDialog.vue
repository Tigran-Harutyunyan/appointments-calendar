<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// To show the confirm modal
const showConfirm = ref(false);
// Resolve promise function
let resolvePromise: (value: PromiseLike<boolean> | boolean) => void;

const confirmTitle = ref<null | string>(null);
const confirmMessage = ref<null | string>(null);
const buttonVariant = ref("primary");

const openModal = (title: string, message: string, variant = "primary") => {
  confirmTitle.value = title;
  confirmMessage.value = message;
  buttonVariant.value = variant;
  showConfirm.value = true;
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
};

const handleUserInput = (value: boolean) => {
  if (!resolvePromise) return;
  resolvePromise(value);
  showConfirm.value = false;
};

defineExpose({ openModal });
</script>

<template>
  <Dialog :open="showConfirm" @update:open="handleUserInput(false)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ confirmTitle }}
        </DialogTitle>
        <DialogDescription>
          {{ confirmMessage }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="pt-2">
        <Button @click="handleUserInput(false)" variant="outline">
          Cancel
        </Button>
        <Button @click="handleUserInput(true)"> Confirm </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
