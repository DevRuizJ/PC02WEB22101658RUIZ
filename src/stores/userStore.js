import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    totalUsers: 0,
    currentUser: null,
    pagination: {
      page: 1,
      rowsPerPage: 10
    }
  }),

  actions: {
    async fetchUsers(page = 1, limit = 10, searchQuery = '') {
      this.loading = true
      this.pagination.page = page
      this.pagination.rowsPerPage = limit
      this.searchQuery = searchQuery

      const skip = (page - 1) * limit

      const url = searchQuery
        ? 'https://dummyjson.com/users/search'
        : 'https://dummyjson.com/users'

      try {
        const response = await axios.get(url, {
          params: { limit, skip, ...(searchQuery && { q: searchQuery }) }
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
