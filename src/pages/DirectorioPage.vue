<template>
  <q-page class="q-pa-md bg-grey-1">
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
        :rows="userStore.users"
        :columns="columns"
        row-key="id"
        :loading="userStore.loading"
        v-model:pagination="quasarPagination"
        @request="onRequest"
        binary-state-sort
      >
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
              @click="verDetalle(props.row)"
            >
              <q-tooltip class="bg-primary">Visualizar detalle completo</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const router = useRouter()

const quasarPagination = ref({
  page: userStore.pagination.page,
  rowsPerPage: userStore.pagination.rowsPerPage,
  rowsNumber: 0
})

watch(() => userStore.totalUsers, (newTotal) => {
  quasarPagination.value.rowsNumber = newTotal
}, { immediate: true })

const columns = [
  {
    name: 'avatar',
    align: 'center',
    label: 'Foto',
    field: 'image'
  },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre Completo',
    field: row => `${row.firstName} ${row.lastName}`,
    sortable: true
  },
  {
    name: 'edad',
    align: 'center',
    label: 'Edad',
    field: 'age',
    sortable: true
  },
  {
    name: 'genero',
    align: 'left',
    label: 'Género',
    field: row => row.gender === 'female' ? 'Femenino' : 'Masculino'
  },
  {
    name: 'email',
    align: 'left',
    label: 'Correo Electrónico',
    field: 'email'
  },
  {
    name: 'empresa',
    align: 'left',
    label: 'Empresa',
    field: row => row.company?.name || 'N/A'
  },
  {
    name: 'cargo',
    align: 'left',
    label: 'Cargo',
    field: row => row.company?.title || 'N/A'
  },
  {
    name: 'ciudad',
    align: 'left',
    label: 'Ciudad',
    field: row => row.address?.city || 'N/A'
  },
  {
    name: 'pais',
    align: 'left',
    label: 'País',
    field: row => row.address?.country || 'N/A'
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones'
  }
]

const onRequest = async (props) => {
  const { page, rowsPerPage } = props.pagination
  quasarPagination.value.page = page
  quasarPagination.value.rowsPerPage = rowsPerPage

  await userStore.fetchUsers(page, rowsPerPage)
}

const verDetalle = (usuario) => {
  userStore.setCurrentUser(usuario)
  router.push({ name: 'empleado-detalle', params: { id: usuario.id } })
}

onMounted(() => {
  userStore.fetchUsers(quasarPagination.value.page, quasarPagination.value.rowsPerPage)
})
</script>
