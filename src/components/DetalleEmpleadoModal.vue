<template>
  <q-dialog v-model="isOpen" persistent max-width="600px" full-width>
    <q-card v-if="empleado" class="column full-height" style="max-width: 650px">

      <q-card-section class="row items-center bg-primary text-white q-pr-md">
        <q-avatar size="60px" class="bg-white shadow-2 q-mr-md">
          <img :src="empleado.image" alt="Avatar">
        </q-avatar>
        <div>
          <div class="text-h6 text-weight-bold">{{ empleado.firstName }} {{ empleado.lastName }}</div>
          <div class="text-caption opacity-80">{{ empleado.company?.title || 'Sin Cargo' }}</div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="personal" label="Personal y Laboral" icon="person" />
        <q-tab name="financiero" label="Finanzas y Cripto" icon="account_balance" />
        <q-tab name="ubicacion" label="Ubicación y Ed." icon="place" />
        <q-tab name="compras" label="Compras" icon="shopping_cart" />
      </q-tabs>

      <q-separator />

      <q-card-section class="col q-pt-md scroll">
        <q-tab-panels v-model="tab" animated>

          <q-tab-panel name="personal" class="q-pa-none">
            <SeccionDetalle titulo="Datos Personales" icon="badge">
              <q-item><q-item-section><q-item-label caption>Edad / Género</q-item-label><q-item-label>{{ empleado.age }} años / {{ empleado.gender === 'female' ? 'Femenino' : 'Masculino' }}</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Correo Electrónico</q-item-label><q-item-label>{{ empleado.email }}</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Teléfono</q-item-label><q-item-label>{{ empleado.phone }}</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Fecha de Nacimiento</q-item-label><q-item-label>{{ empleado.birthDate }}</q-item-label></q-item-section></q-item>
            </SeccionDetalle>

            <SeccionDetalle titulo="Información Física" icon="accessibility">
              <q-item><q-item-section><q-item-label caption>Altura / Peso</q-item-label><q-item-label>{{ empleado.height }} cm / {{ empleado.weight }} kg</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Grupo Sanguíneo / Ojos</q-item-label><q-item-label>{{ empleado.bloodGroup }} / {{ empleado.eyeColor }}</q-item-label></q-item-section></q-item>
            </SeccionDetalle>

            <SeccionDetalle titulo="Información Laboral" icon="business_center">
              <q-item><q-item-section><q-item-label caption>Empresa</q-item-label><q-item-label class="text-weight-medium">{{ empleado.company?.name }}</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Departamento</q-item-label><q-item-label>{{ empleado.company?.department }}</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Rol del Sistema</q-item-label><q-item-label class="text-uppercase text-caption text-weight-bold">{{ empleado.role }}</q-item-label></q-item-section></q-item>
            </SeccionDetalle>
          </q-tab-panel>

          <q-tab-panel name="financiero" class="q-pa-none">
            <SeccionDetalle titulo="Información Bancaria" icon="credit_card">
              <q-item><q-item-section><q-item-label caption>Banco / Tipo de Tarjeta</q-item-label><q-item-label>{{ empleado.bank?.cardType }}</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Número de Tarjeta</q-item-label><q-item-label>**** **** **** {{ empleado.bank?.cardNumber?.slice(-4) }}</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Moneda / IBAN</q-item-label><q-item-label>{{ empleado.bank?.currency }} / {{ empleado.bank?.iban }}</q-item-label></q-item-section></q-item>
            </SeccionDetalle>

            <SeccionDetalle titulo="Criptomonedas" icon="currency_bitcoin">
              <q-item><q-item-section><q-item-label caption>Moneda / Red</q-item-label><q-item-label>{{ empleado.crypto?.coin }} ({{ empleado.crypto?.network }})</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Billetera Digital</q-item-label><q-item-label class="text-caption text-break">{{ empleado.crypto?.wallet }}</q-item-label></q-item-section></q-item>
            </SeccionDetalle>
          </q-tab-panel>

          <q-tab-panel name="ubicacion" class="q-pa-none">
            <SeccionDetalle titulo="Dirección Residencial" icon="home">
              <q-item><q-item-section><q-item-label caption>Dirección / Código Postal</q-item-label><q-item-label>{{ empleado.address?.address }}, {{ empleado.address?.postalCode }}</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>Ciudad / Estado</q-item-label><q-item-label>{{ empleado.address?.city }}, {{ empleado.address?.state }} ({{ empleado.address?.stateCode }})</q-item-label></q-item-section></q-item>
              <q-item><q-item-section><q-item-label caption>País</q-item-label><q-item-label>{{ empleado.address?.country }}</q-item-label></q-item-section></q-item>
            </SeccionDetalle>

            <SeccionDetalle titulo="Educación Superior" icon="school">
              <q-item><q-item-section><q-item-label caption>Universidad</q-item-label><q-item-label>{{ empleado.university }}</q-item-label></q-item-section></q-item>
            </SeccionDetalle>
          </q-tab-panel>

          <q-tab-panel name="compras" class="q-pa-none">
            <PestañaCompras :userId="empleado.id" />
          </q-tab-panel>

        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-grey-2">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import SeccionDetalle from './SeccionDetalle.vue'
import PestañaCompras from './PestañaCompras.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  empleado: { type: Object, default: null }
})

const emit = defineEmits(['update:model-value'])

const tab = ref('personal')

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value)
})
</script>
