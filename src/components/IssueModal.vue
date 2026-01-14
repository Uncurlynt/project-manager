<template>
  <v-dialog v-model="isOpen" width="600">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>

      <v-form ref="form" lazy-validation @submit.prevent="submit">
        <v-card-text>
          <v-text-field
              v-model="title"
              label="Название"
              :rules="[required('Название')]"
          />

          <v-textarea
              v-model="description"
              label="Описание"
              :rules="[required('Описание')]"
          />

          <v-select
              v-model="boardId"
              :items="boards"
              item-title="name"
              item-value="id"
              label="Проект"
              :disabled="isEditing"
              :rules="[required('Проект')]"
          />

          <v-select
              v-model="priority"
              :items="priorityOptions"
              label="Приоритет"
              :chips="true"
              :item-props="(props: any) => ({ color: priorityColor(props.value) })"

          />

          <v-select
              v-if="isEditing"
              v-model="status"
              :items="statusOptions"
              label="Статус"
              :chips="true"
              :item-props="(props: any) => ({ color: priorityColor(props.value) })"
          />

          <v-autocomplete
              v-model="assignee"
              :items="users"
              item-title="fullName"
              item-value="id"
              label="Исполнитель"
              clearable
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-avatar size="24">
                    <img :src="item.raw.avatarUrl" :alt="item.raw.fullName" />
                  </v-avatar>
                </template>
                {{ item.raw.fullName }}
              </v-list-item>
            </template>

            <template #selection="{ item }">
              <v-chip v-if="item" size="small">
                <v-avatar size="20" start>
                  <img :src="item.raw.avatarUrl" />
                </v-avatar>
                {{ item.raw.fullName }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="goToBoard" v-if="showGoToBoard">Перейти на доску</v-btn>
          <v-spacer />
          <v-btn text @click="close">Отмена</v-btn>
          <v-btn type="submit" color="primary">
            {{ isEditing ? 'Обновить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios          from 'axios'
import { useUiStore } from '@/stores/ui'
import { useBoardsStore } from '@/stores/boards'
import { useIssuesStore } from '@/stores/issues'
import type { IssueStatus } from '@/types'

//stores
const ui          = useUiStore()
const boardsStore = useBoardsStore()
const issuesStore = useIssuesStore()

//router
const route  = useRoute()
const router = useRouter()

//state
const form        = ref()
const isOpen      = computed(() => ui.isModalOpen)
const editingIssue= computed(() => ui.modalIssue)
const isEditing   = computed(() => !!editingIssue.value)

const title       = ref('')
const description = ref('')
const boardId     = ref<number | ''>('')
const priority    = ref<'Low' | 'Medium' | 'High'>('Medium')
const assignee    = ref<number | null>(null)
const status      = ref<IssueStatus>('Backlog')

const priorityOptions = ['Low','Medium','High']
const statusOptions   = ['Backlog','InProgress','Done']

//  данные для селектов
const boards = computed(() => boardsStore.boards)
const users  = ref<any[]>([])

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/v1/users')
    users.value = data.data
  } catch {
    ui.showSnackbar('Не удалось загрузить список пользователей', 'error')
  }
})

//  инициализация при открытии модалки
watch(isOpen, open => {
  if (!open) return

  if (editingIssue.value) {
    const i = editingIssue.value
    title.value       = i.title
    description.value = i.description
    boardId.value     = i.boardId
    priority.value    = i.priority
    assignee.value    = i.assigneeId ?? null
    status.value      = i.status
  } else {
    title.value = description.value = ''
    boardId.value  = ''
    priority.value = 'Medium'
    assignee.value = null
    status.value   = 'Backlog'

    const m = route.path.match(/\/board\/(\d+)/)
    if (m) boardId.value = Number(m[1])
  }
}, { immediate: true })

//helpers
const required = (label: string) => (v: any) => !!v || `${label} обязательное`

const statusColor   = (s: IssueStatus) => s === 'Backlog' ? 'backlog' : s === 'InProgress' ? 'inprogress' : 'done'
const priorityColor = (p: string)      => p === 'Low'     ? 'low'     : p === 'Medium'     ? 'medium'     : 'high'

//submit
const submit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return

  try {
    if (isEditing.value && editingIssue.value) {
      const finalAssigneeId = assignee.value !== null
          ? assignee.value
          : (editingIssue.value?.assigneeId ?? null)

      await issuesStore.updateIssue(editingIssue.value.id, {
        title:       title.value,
        description: description.value,
        priority:    priority.value,
        status:      status.value,
        assigneeId:  finalAssigneeId
      })
      ui.showSnackbar('Задача обновлена')
    } else {
      await issuesStore.createIssue({
        title: title.value,
        description: description.value,
        priority: priority.value,
        boardId: Number(boardId.value),
        assigneeId: assignee.value ?? undefined,
        status: 'Backlog'
      })
      ui.showSnackbar('Задача создана')
    }
    ui.closeModal()
  } catch {
    ui.showSnackbar('Операция не выполнена', 'error')
  }
}

const close         = () => ui.closeModal()
const showGoToBoard = computed(() => route.path.startsWith('/issues') && (editingIssue.value || boardId.value))
const goToBoard     = () => {
  const id = editingIssue.value ? editingIssue.value.boardId : Number(boardId.value)
  ui.closeModal()
  router.push(`/board/${id}`)
}
const dialogTitle   = computed(() => isEditing.value ? 'Редактирование задачи' : 'Создание задачи')
</script>
