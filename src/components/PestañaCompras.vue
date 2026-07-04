<template>
  <div class="q-pa-sm">
    <div v-if="loading" class="row justify-center q-my-md">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="carts.length === 0" class="text-center q-pa-md text-grey-6">
      <q-icon name="shopping_cart" size="48px" class="q-mb-sm" />
      <div>Este colaborador no registra carritos de compra activos.</div>
    </div>

    <div v-else>
      <div v-for="(cart, index) in carts" :key="cart.id" class="q-mb-lg">
        <div class="row items-center justify-between bg-blue-1 text-blue-9 q-pa-sm rounded-borders q-mb-sm">
          <div class="text-weight-bold">
            <q-icon name="shopping_bag" class="q-mr-xs" />
            Carrito #{{ index + 1 }} (ID: {{ cart.id }})
          </div>
          <div class="text-caption">Total Productos: {{ cart.totalProducts }}</div>
        </div>

        <q-table
          flat
          bordered
          dense
          :rows="cart.products"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 0 }"
          hide-bottom
          class="bg-white"
        >
          <template v-slot:body-cell-price="props">
            <q-td :props="props">
              ${{ props.row.price.toFixed(2) }}
            </q-td>
          </template>

          <template v-slot:body-cell-total="props">
            <q-td :props="props" class="text-weight-medium text-grey-9">
              ${{ props.row.total.toFixed(2) }}
            </q-td>
          </template>
        </q-table>

        <div class="row justify-end q-mt-sm q-pr-md">
          <div class="text-right">
            <div class="text-grey-7 text-caption">Total con Descuento:</div>
            <div class="text-h6 text-weight-bold text-positive">
              ${{ cart.discountedTotal.toFixed(2) }}
            </div>
          </div>
        </div>
        <q-separator class="q-mt-md" v-if="index < carts.length - 1" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

const carts = ref([])
const loading = ref(false)

const columns = [
  { name: 'title', align: 'left', label: 'Producto', field: 'title', style: 'max-width: 200px; white-space: normal;' },
  { name: 'quantity', align: 'center', label: 'Cant.', field: 'quantity' },
  { name: 'price', align: 'right', label: 'Precio Unitario', field: 'price' },
  { name: 'total', align: 'right', label: 'Subtotal', field: 'total' }
]
const fetchUserCarts = async () => {
  loading.value = true
  try {
    const response = await axios.get(`https://dummyjson.com/users/${props.userId}/carts`)
    carts.value = response.data.carts
  } catch (error) {
    console.error('Error al obtener los carritos del colaborador:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserCarts()
})
</script>
