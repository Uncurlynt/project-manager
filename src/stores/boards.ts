import { defineStore } from 'pinia'
import axios from 'axios'
import type { Board } from '@/types'

export const useBoardsStore = defineStore('boards', {
  state: () => ({
    boards: [] as Board[]
  }),
  actions: {
    async fetchBoards() {
      try {
        const res = await axios.get('/api/v1/boards')
        this.boards = res.data.data
      } catch (err) {
        console.error('Failed to fetch boards', err)
      }
    }
  }
})
