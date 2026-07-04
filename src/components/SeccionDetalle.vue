<template>
  <div class="q-mb-md">
    <div class="row items-center q-mb-sm text-subtitle1 text-weight-bold text-primary">
      <q-icon :name="icon" class="q-mr-sm" size="xs" />
      {{ titulo }}
    </div>
    <q-list dense class="bg-grey-1 rounded-borders q-pa-xs">
      <slot></slot>
    </q-list>
  </div>
</template>

<script setup>
defineProps({
  titulo: { type: String, required: true },
  icon: { type: String, required: true }
})
</script>
