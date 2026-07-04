<template>
  <q-input
    outlined
    dense
    debounce="500"
    v-model="searchLocal"
    :placeholder="placeholder"
    :style="{ width: width }"
    @update:model-value="onSearchChange"
  >
    <template v-slot:append>
      <q-icon
        :name="searchLocal ? 'clear' : 'search'"
        :class="searchLocal ? 'cursor-pointer' : ''"
        @click="clearSearch"
      />
    </template>
  </q-input>
</template>

<script setup>
import { ref, watch } from 'vue'

// Definimos propiedades para que el componente sea altamente reutilizable
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  },
  width: {
    type: String,
    default: '250px'
  }
})

// Definimos los eventos que emitirá hacia el padre
const emit = defineEmits(['update:model-value', 'search'])

// Estado local sincronizado
const searchLocal = ref(props.modelValue)

// Escuchar si el valor cambia desde el exterior (ej. si se limpia desde fuera)
watch(() => props.modelValue, (newVal) => {
  searchLocal.value = newVal
})

// Emete el evento cada vez que el debounce de Quasar termina de procesar la escritura
const onSearchChange = (value) => {
  emit('update:model-value', value)
  emit('search', value)
}

// Función adicional muy útil para limpiar el buscador con un clic en la 'X'
const clearSearch = () => {
  if (searchLocal.value) {
    searchLocal.value = ''
    onSearchChange('')
  }
}
</script>
