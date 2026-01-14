import { defineStore } from 'pinia'
import type { Issue } from '@/types'

type SnackbarType = 'success' | 'error'

interface SnackbarState {
  show:    boolean
  message: string
  type:    SnackbarType
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    // модалка
    isModalOpen: false as boolean,
    modalIssue:  null as Issue | null,
    // тема
    isDark:      localStorage.getItem('dark') === 'true',
    // добавляем snackbar в state:
    snackbar: {
      show:    false,
      message: '',
      type:    'success'
    } as SnackbarState,
  }),
  actions: {
    openModal(issue?: Issue) {
      this.isModalOpen = true
      this.modalIssue  = issue ?? null
    },
    closeModal() {
      this.isModalOpen = false
      this.modalIssue  = null
    },

    showSnackbar(message: string, type: SnackbarType = 'success') {
      this.snackbar = { show: true, message, type }
      setTimeout(() => { this.snackbar.show = false }, 3000)
    }
  },
})
