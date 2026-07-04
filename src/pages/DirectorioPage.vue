<template>
  <q-page class="q-pa-md bg-grey-1">

    <FiltrosDirectorio
      :usuarios="userStore.users"
      @change="manejarCambioFiltros"
    />

    <q-banner v-if="seleccionados.length > 0" inline-actions class="bg-teal-1 text-teal-9 q-mb-md rounded-borders shadow-1">
      <template v-slot:avatar>
        <q-icon name="compare_arrows" color="teal" />
      </template>
      Sección de comparación: Has seleccionado <strong>{{ seleccionados.length }}</strong> de 2 colaboradores máximos recomendados.
      <template v-slot:action>
        <q-btn
          flat
          dense
          label="Comparar Perfiles"
          color="teal"
          icon="launch"
          :disabled="seleccionados.length !== 2"
          @click="abrirComparador"
        />
        <q-btn flat dense label="Limpiar" color="grey" @click="seleccionados = []" />
      </template>
    </q-banner>

    <q-card flat bordered class="shadow-2">
      <q-card-section class="bg-white q-py-md">
        <div class="row items-center no-wrap">
          <q-avatar icon="badge" color="primary" text-color="white" class="q-mr-md" />
          <div>
            <div class="text-h5 text-weight-bold text-grey-9">Directorio Corporativo</div>
            <div class="text-caption text-grey-6">Consulta y búsqueda de colaboradores registrados</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-table
        flat
        :rows="usuariosFiltrados"
        :columns="columns"
        row-key="id"
        selection="multiple"
        v-model:selected="seleccionados"
        :loading="userStore.loading"
        v-model:pagination="quasarPagination"
        :filter="filterText"
        @request="onRequest"
        binary-state-sort
      >
        <template v-slot:top-right>
          <BuscadorEmpleados
            v-model="filterText"
            placeholder="Buscar por nombre o apellido..."
            width="280px"
          />
        </template>

        <template v-slot:body-cell-avatar="props">
          <q-td :props="props">
            <q-avatar size="42px" class="shadow-1 bg-grey-2">
              <img :src="props.row.image" alt="Foto de perfil">
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" class="text-center">
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              size="sm"
              :loading="loadingDetalleId === props.row.id"
              @click="cargarYVerDetalle(props.row.id)"
            >
              <q-tooltip class="bg-primary">Visualizar detalle completo</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <DetalleEmpleadoModal
      v-model="modalAbierto"
      :empleado="empleadoSeleccionado"
    />

    <ComparadorEmpleadosModal
      v-model="modalComparadorAbierto"
      :usuarios="usuariosAComparar"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { useUserStore } from '../stores/userStore'
import BuscadorEmpleados from '../components/BuscadorEmpleados.vue'
import DetalleEmpleadoModal from '../components/DetalleEmpleadoModal.vue'
import FiltrosDirectorio from '../components/FiltrosDirectorio.vue'
// IMPORTACIÓN DEL NUEVO COMPONENTE COMPARADOR
import ComparadorEmpleadosModal from '../components/ComparadorEmpleadosModal.vue'

const userStore = useUserStore()

const modalAbierto = ref(false)
const empleadoSeleccionado = ref(null)
const loadingDetalleId = ref(null)

// ESTADOS PARA LA SELECCIÓN Y COMPARACIÓN MODULAR
const seleccionados = ref([])
const modalComparadorAbierto = ref(false)
const usuariosAComparar = ref([])

const filterText = ref(userStore.searchQuery)

const filtrosActivos = ref({
  gender: null,
  company: null,
  city: null,
  country: null,
  ageRange: { min: 15, max: 80 }
})

const quasarPagination = ref({ page: userStore.pagination.page, rowsPerPage: userStore.pagination.rowsPerPage, rowsNumber: 0 })
watch(() => userStore.totalUsers, (newTotal) => { quasarPagination.value.rowsNumber = newTotal }, { immediate: true })

const usuariosFiltrados = computed(() => {
  let resultado = userStore.users || []
  if (filtrosActivos.value.gender) resultado = resultado.filter(u => u.gender === filtrosActivos.value.gender)
  if (filtrosActivos.value.company) resultado = resultado.filter(u => u.company?.name === filtrosActivos.value.company)
  if (filtrosActivos.value.city) resultado = resultado.filter(u => u.address?.city === filtrosActivos.value.city)
  if (filtrosActivos.value.country) resultado = resultado.filter(u => u.address?.country === filtrosActivos.value.country)
  if (filtrosActivos.value.ageRange) {
    const { min, max } = filtrosActivos.value.ageRange
    resultado = resultado.filter(u => u.age >= min && u.age <= max)
  }
  return resultado
})

const columns = [
  { name: 'avatar', align: 'center', label: 'Foto', field: 'image' },
  { name: 'nombre', align: 'left', label: 'Nombre Completo', field: row => `${row.firstName} ${row.lastName}`, sortable: true },
  { name: 'edad', align: 'center', label: 'Edad', field: 'age', sortable: true },
  { name: 'genero', align: 'left', label: 'Género', field: row => row.gender === 'female' ? 'Femenino' : 'Masculino' },
  { name: 'email', align: 'left', label: 'Correo Electrónico', field: 'email' },
  { name: 'empresa', align: 'left', label: 'Empresa', field: row => row.company?.name || 'N/A' },
  { name: 'cargo', align: 'left', label: 'Cargo', field: row => row.company?.title || 'N/A' },
  { name: 'ciudad', align: 'left', label: 'Ciudad', field: row => row.address?.city || 'N/A' },
  { name: 'pais', align: 'left', label: 'País', field: row => row.address?.country || 'N/A' },
  { name: 'acciones', align: 'center', label: 'Acciones', field: 'acciones' }
]

const onRequest = async (props) => {
  const { page, rowsPerPage } = props.pagination
  const filter = props.filter || ''
  quasarPagination.value.page = page
  quasarPagination.value.rowsPerPage = rowsPerPage
  await userStore.fetchUsers(page, rowsPerPage, filter)
}

const manejarCambioFiltros = (nuevosFiltros) => { filtrosActivos.value = nuevosFiltros }

// ACCIÓN: Consume secuencialmente el endpoint por ID para ambos colaboradores antes de abrir el modal
const abrirComparador = async () => {
  if (seleccionados.value.length !== 2) return

  // Bloqueamos la UI con el loading nativo de Quasar mientras descargamos los detalles técnicos completos
  const [user1, user2] = seleccionados.value

  try {
    // Ejecutamos ambas peticiones en paralelo de forma eficiente usando Promise.all
    const [res1, res2] = await Promise.all([
      axios.get(`https://dummyjson.com/users/${user1.id}`),
      axios.get(`https://dummyjson.com/users/${user2.id}`)
    ])

    usuariosAComparar.value = [res1.data, res2.data]
    modalComparadorAbierto.value = true
  } catch (error) {
    console.error('Error al descargar la información completa para comparar:', error)
  }
}

const cargarYVerDetalle = async (id) => {
  loadingDetalleId.value = id
  try {
    const response = await axios.get(`https://dummyjson.com/users/${id}`)
    empleadoSeleccionado.value = response.data
    userStore.setCurrentUser(response.data)
    modalAbierto.value = true
  } catch (error) {
    console.error('Error al consultar el detalle del usuario por ID:', error)
  } finally {
    loadingDetalleId.value = null
  }
}

onMounted(() => {
  userStore.fetchUsers(quasarPagination.value.page, quasarPagination.value.rowsPerPage, filterText.value)
})
</script>
