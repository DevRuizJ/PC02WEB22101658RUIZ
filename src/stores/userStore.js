import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    totalUsers: 0,
    currentUser: null, // Guardará el usuario seleccionado para el detalle
    pagination: {
      page: 1,
      rowsPerPage: 10
    }
  }),

  actions: {
    async fetchUsers(page = 1, limit = 10) {
      this.loading = true
      this.pagination.page = page
      this.pagination.rowsPerPage = limit

      const skip = (page - 1) * limit

      try {
        const response = await axios.get('https://dummyjson.com/users', {
          params: { limit, skip }
        })

        this.users = response.data.users
        this.totalUsers = response.data.total
      } catch (error) {
        console.error('Error al obtener usuarios de DummyJSON:', error)
      } finally {
        this.loading = false
      }
    },

    setCurrentUser(user) {
      this.currentUser = user
    }
  }
})
