<template>
  <q-card flat bordered class="q-mb-md bg-white shadow-1">
    <q-card-section class="q-pb-none">
      <div class="row items-center q-gutter-sm text-subtitle2 text-weight-bold text-grey-8">
        <q-icon name="filter_alt" color="primary" size="xs" />
        Filtros Avanzados (Actualización Dinámica)
      </div>
    </q-card-section>

    <q-card-section>
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm-6 col-md-2">
          <q-select
            outlined
            dense
            clearable
            v-model="filtros.gender"
            :options="opcionesGenero"
            label="Género"
            emit-value
            map-options
            @update:model-value="notificarCambio"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            outlined
            dense
            clearable
            use-input
            input-debounce="0"
            v-model="filtros.company"
            :options="opcionesEmpresaFiltradas"
            label="Empresa"
            @filter="filtrarEmpresas"
            @update:model-value="notificarCambio"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-2">
          <q-select
            outlined
            dense
            clearable
            use-input
            input-debounce="0"
            v-model="filtros.city"
            :options="opcionesCiudadFiltradas"
            label="Ciudad"
            @filter="filtrarCiudades"
            @update:model-value="notificarCambio"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-2">
          <q-select
            outlined
            dense
            clearable
            v-model="filtros.country"
            :options="opcionesPais"
            label="País"
            @update:model-value="notificarCambio"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3 q-px-md">
          <div class="text-caption text-grey-7 row justify-between">
            <span>Rango de Edad:</span>
            <span class="text-weight-bold text-primary">{{ filtros.ageRange.min }} - {{ filtros.ageRange.max }} años</span>
          </div>
          <q-range
            v-model="filtros.ageRange"
            :min="15"
            :max="80"
            :step="1"
            label
            color="primary"
            @update:model-value="notificarCambio"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  usuarios: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['change'])

// Estado interno de los filtros
const filtros = ref({
  gender: null,
  company: null,
  city: null,
  country: null,
  ageRange: { min: 15, max: 80 }
})

// Opciones fijas para Género
const opcionesGenero = [
  { label: 'Todos', value: null },
  { label: 'Femenino', value: 'female' },
  { label: 'Masculino', value: 'male' }
]

// --- Extracción de Opciones Únicas dinámicamente desde las Props ---
const opcionesEmpresa = computed(() => {
  const distintas = new Set(props.usuarios.map(u => u.company?.name).filter(Boolean))
  return Array.from(distintas).sort()
})

const opcionesCiudad = computed(() => {
  const distintas = new Set(props.usuarios.map(u => u.address?.city).filter(Boolean))
  return Array.from(distintas).sort()
})

const opcionesPais = computed(() => {
  const distintas = new Set(props.usuarios.map(u => u.address?.country).filter(Boolean))
  return Array.from(distintas).sort()
})

// Variables para el soporte de búsqueda interna dentro de los QSelects (Autocomplete)
const opcionesEmpresaFiltradas = ref([])
const opcionesCiudadFiltradas = ref([])

watch(opcionesEmpresa, (val) => { opcionesEmpresaFiltradas.value = val }, { immediate: true })
watch(opcionesCiudad, (val) => { opcionesCiudadFiltradas.value = val }, { immediate: true })

// Manejadores de auto-completado/búsqueda en los combos
const filtrarEmpresas = (val, update) => {
  update(() => {
    const aguja = val.toLowerCase()
    opcionesEmpresaFiltradas.value = opcionesEmpresa.value.filter(v => v.toLowerCase().indexOf(aguja) > -1)
  })
}

const filtrarCiudades = (val, update) => {
  update(() => {
    const aguja = val.toLowerCase()
    opcionesCiudadFiltradas.value = opcionesCiudad.value.filter(v => v.toLowerCase().indexOf(aguja) > -1)
  })
}

// Emite los filtros actuales hacia el componente padre
const notificarCambio = () => {
  emit('change', { ...filtros.value })
}
</script>
