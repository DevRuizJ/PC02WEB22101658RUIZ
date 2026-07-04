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

const emit = defineEmits(['update:model-value', 'search'])

const searchLocal = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  searchLocal.value = newVal
})

const onSearchChange = (value) => {
  emit('update:model-value', value)
  emit('search', value)
}

const clearSearch = () => {
  if (searchLocal.value) {
    searchLocal.value = ''
    onSearchChange('')
  }
}
</script>
