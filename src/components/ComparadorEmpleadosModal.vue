<template>
  <q-dialog v-model="isOpen" max-width="800px" full-width>
    <q-card v-if="usuarios && usuarios.length === 2" class="q-pa-sm">

      <q-card-section class="row items-center bg-teal text-white q-py-sm">
        <div class="text-h6 text-weight-bold">
          <q-icon name="compare_arrows" class="q-mr-xs" />
          Comparativa de Colaboradores
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-md q-pa-md bg-grey-2 text-center items-center">
          <div class="col-4 text-left text-weight-bold text-grey-7">Características</div>

          <div class="col-4 text-center">
            <q-avatar size="65px" class="bg-white shadow-1 q-mb-xs">
              <img :src="usuarios[0].image" alt="Avatar 1">
            </q-avatar>
            <div class="text-subtitle1 text-weight-bold text-primary">
              {{ usuarios[0].firstName }} {{ usuarios[0].lastName }}
            </div>
          </div>

          <div class="col-4 text-center">
            <q-avatar size="65px" class="bg-white shadow-1 q-mb-xs">
              <img :src="usuarios[1].image" alt="Avatar 2">
            </q-avatar>
            <div class="text-subtitle1 text-weight-bold text-secondary">
              {{ usuarios[1].firstName }} {{ usuarios[1].lastName }}
            </div>
          </div>
        </div>

        <q-list separator dense class="q-px-md q-pb-md">
          <q-item v-for="fila in filasComparativas" :key="fila.label" class="q-py-md">
            <q-item-section class="col-4 text-weight-medium text-grey-8">
              {{ fila.label }}
            </q-item-section>

            <q-item-section class="col-4 text-center border-right text-grey-9">
              {{ fila.val1 }}
            </q-item-section>

            <q-item-section class="col-4 text-center text-grey-9">
              {{ fila.val2 }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Cerrar Comparación" color="teal" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  usuarios: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:model-value'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value)
})

// Mapeamos dinámicamente las propiedades de ambos usuarios solicitadas por el requerimiento
const filasComparativas = computed(() => {
  if (!props.usuarios || props.usuarios.length < 2) return []

  const [u1, u2] = props.usuarios

  return [
    { label: 'Edad', val1: `${u1.age} años`, val2: `${u2.age} años` },
    { label: 'Género', val1: u1.gender === 'female' ? 'Femenino' : 'Masculino', val2: u2.gender === 'female' ? 'Femenino' : 'Masculino' },
    { label: 'Empresa', val1: u1.company?.name || 'N/A', val2: u2.company?.name || 'N/A' },
    { label: 'Cargo', val1: u1.company?.title || 'N/A', val2: u2.company?.title || 'N/A' },
    { label: 'Universidad', val1: u1.university || 'N/A', val2: u2.university || 'N/A' },
    { label: 'Ciudad', val1: u1.address?.city || 'N/A', val2: u2.address?.city || 'N/A' },
    { label: 'País', val1: u1.address?.country || 'N/A', val2: u2.address?.country || 'N/A' },
    { label: 'Altura', val1: `${u1.height} cm`, val2: `${u2.height} cm` },
    { label: 'Peso', val1: `${u1.weight} kg`, val2: `${u2.weight} kg` },
    { label: 'Grupo Sanguíneo', val1: u1.bloodGroup || 'N/A', val2: u2.bloodGroup || 'N/A' }
  ]
})
</script>

<style scoped>
.border-right {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
