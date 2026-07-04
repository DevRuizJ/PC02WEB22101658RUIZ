<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center justify-between q-mb-lg bg-white q-pa-md rounded-borders shadow-1">
      <div class="row items-center no-wrap">
        <q-avatar icon="analytics" color="secondary" text-color="white" class="q-mr-md" />
        <div>
          <div class="text-h5 text-weight-bold text-grey-9">Dashboard Gerencial</div>
          <div class="text-caption text-grey-6">Indicadores clave y analíticas de la fuerza laboral</div>
        </div>
      </div>
      <q-btn
        flat
        round
        color="grey-7"
        icon="refresh"
        :loading="loading"
        @click="cargarDatosDashboard"
      >
        <q-tooltip>Actualizar indicadores</q-tooltip>
      </q-btn>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4">
        <CardIndicador
          titulo="Total Colaboradores"
          :valor="metricas.total"
          icon="groups"
          color="blue-8"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <CardIndicador
          titulo="Cantidad Hombres"
          :valor="metricas.hombres"
          icon="male"
          color="indigo-7"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <CardIndicador
          titulo="Cantidad Mujeres"
          :valor="metricas.mujeres"
          icon="female"
          color="pink-6"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <CardIndicador
          titulo="Promedio de Edad"
          :valor="`${metricas.promedioEdad} años`"
          icon="cake"
          color="orange-8"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <CardIndicador
          titulo="Empresas Distintas"
          :valor="metricas.empresasDistintas"
          icon="apartment"
          color="teal-7"
          :loading="loading"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <CardIndicador
          titulo="Ciudades Distintas"
          :valor="metricas.ciudadesDistintas"
          icon="location_city"
          color="cyan-8"
          :loading="loading"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CardIndicador from '../components/CardIndicator.vue'

const loading = ref(false)

// Estado reactivo que guardará los cálculos requeridos
const metricas = ref({
  total: 0,
  hombres: 0,
  mujeres: 0,
  promedioEdad: 0,
  empresasDistintas: 0,
  ciudadesDistintas: 0
})

const cargarDatosDashboard = async () => {
  loading.value = true
  try {
    // IMPORTANTE: limit=0 le indica a DummyJSON que devuelva TODOS los usuarios existentes
    const response = await axios.get('https://dummyjson.com/users', {
      params: { limit: 0 }
    })

    const todosLosUsuarios = response.data.users || []

    // 1. Total de usuarios
    const total = todosLosUsuarios.length

    if (total > 0) {
      // 2 y 3. Conteo de Géneros
      const hombres = todosLosUsuarios.filter(u => u.gender === 'male').length
      const mujeres = todosLosUsuarios.filter(u => u.gender === 'female').length

      // 4. Promedio de Edad
      const sumaEdades = todosLosUsuarios.reduce((acc, u) => acc + (u.age || 0), 0)
      const promedioEdad = (sumaEdades / total).toFixed(1)

      // 5. Número de empresas distintas (Usamos Set para eliminar duplicados de forma eficiente)
      const empresasSet = new Set(
        todosLosUsuarios
          .map(u => u.company?.name?.trim())
          .filter(name => name) // Filtra valores falsy o nulos
      )
      const empresasDistintas = empresasSet.size

      // 6. Número de ciudades distintas (Usamos Set para eliminar duplicados)
      const ciudadesSet = new Set(
        todosLosUsuarios
          .map(u => u.address?.city?.trim())
          .filter(city => city)
      )
      const ciudadesDistintas = ciudadesSet.size

      // Asignamos los cálculos al estado reactivo
      metricas.value = {
        total,
        hombres,
        mujeres,
        promedioEdad,
        empresasDistintas,
        ciudadesDistintas
      }
    }
  } catch (error) {
    console.error('Error al procesar los datos del dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarDatosDashboard()
})
</script>
