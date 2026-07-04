<template>
  <q-card flat bordered class="shadow-1 rounded-borders full-height">
    <q-card-section class="row items-center no-wrap q-pa-md">
      <q-avatar :icon="icon" :color="color" text-color="white" size="48px" class="q-mr-md shadow-1" />

      <div>
        <div class="text-grey-7 text-subtitle2 text-weight-medium text-uppercase tracking-close">
          {{ titulo }}
        </div>
        <div class="text-h4 text-weight-bold text-grey-9 q-mt-xs">
          <span v-if="loading">
            <q-skeleton type="text" width="60px" class="inline-block" />
          </span>
          <span v-else>
            {{ valor }}
          </span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  titulo: { type: String, required: true },
  valor: { type: [String, Number], required: true },
  icon: { type: String, required: true },
  color: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false }
})
</script>

<style scoped>
.tracking-close {
  letter-spacing: 0.5px;
  font-size: 0.75rem;
}
</style>
