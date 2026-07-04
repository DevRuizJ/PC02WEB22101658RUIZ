const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      //{ path: '', component: () => import('@/pages/IndexPage.vue') },
      //{ path: 'second', component: () => import('@/pages/SecondPage.vue') }
      { path: '', name: 'directorio', component: () => import('@/pages/DirectorioPage.vue') }
      //{ path: 'empleados/:id', name: 'empleado-detalle', component: () => import('@/pages/EmpleadoDetallePage.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes
