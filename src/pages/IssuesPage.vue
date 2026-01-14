<template>
  <v-container>
    <v-row class="mb-4" align="center" dense>
      <v-col cols="12" md="4">
        <v-text-field v-model="search" label="Поиск" />
      </v-col>
      <v-col cols="6" md="3">
        <v-select
            v-model="projectFilter"
            :items="[{ id: 'all', name: 'Все проекты' }, ...boards]"
            item-title="name"
            item-value="id"
            label="Проект"
        />
      </v-col>
      <v-col cols="6" md="3">
        <v-select
            v-model="statusFilter"
            :items="['all','Backlog','InProgress','Done']"
            label="Статус"
        />
      </v-col>
    </v-row>

    <v-skeleton-loader type="list-item-avatar-two-line" v-if="loading" />

    <v-alert type="error" v-if="error">{{ error }}</v-alert>

    <v-list two-line v-if="!loading && !error">
      <v-list-item
          v-for="issue in filteredIssues"
          :key="issue.id"
          @click="open(issue)"
      >
        <v-list-item-title>{{ issue.title }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ getBoardName(issue.boardId) }} •
          <v-chip :color="statusColor(issue.status)" size="small" class="me-1">{{ issue.status }}</v-chip>
          <v-chip :color="priorityColor(issue.priority)" size="small">{{ issue.priority }}</v-chip>
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item v-if="filteredIssues.length === 0">
        <v-list-item-title>Задачи не найдены.</v-list-item-title>
      </v-list-item>
    </v-list>

    <div class="text-right mt-4">
      <v-btn color="primary" @click="open()">Создать задачу</v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBoardsStore } from '@/stores/boards'
import { useIssuesStore } from '@/stores/issues'
import { useUiStore } from '@/stores/ui'

const boardsStore = useBoardsStore()
const issuesStore = useIssuesStore()
const ui = useUiStore()

const loading = ref(false)
const error = ref<string | null>(null)

const search = ref('')
const projectFilter = ref<'all' | number>('all')
const statusFilter = ref<'all' | string>('all')

onMounted(async () => {
  try {
    loading.value = true
    if (boardsStore.boards.length === 0) await boardsStore.fetchBoards()
    if (issuesStore.issues.length === 0) await issuesStore.fetchAllIssues()
  } catch (e) {
    error.value = 'Не удалось загрузить задачи или доски.'
  } finally {
    loading.value = false
  }
})

const boards = computed(() => boardsStore.boards)

const filteredIssues = computed(() => {
  return issuesStore.issues.filter(issue => {
    const matchesSearch = (issue.title + issue.description).toLowerCase().includes(search.value.toLowerCase())
    const matchesProject = projectFilter.value === 'all' || issue.boardId === projectFilter.value
    const matchesStatus = statusFilter.value === 'all' || issue.status === statusFilter.value
    return matchesSearch && matchesProject && matchesStatus
  })
})

const getBoardName = (id: number) => boardsStore.boards.find(b => b.id === id)?.name || ''
const statusColor = (s: string) => s === 'Backlog' ? 'default' : s === 'InProgress' ? 'warning' : 'success'
const priorityColor = (p: string) => p === 'Low' ? 'default' : p === 'Medium' ? 'primary' : 'error'

const open = (issue?: any) => ui.openModal(issue)
</script>
