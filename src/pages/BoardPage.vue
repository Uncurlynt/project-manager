<template>
  <v-container>
    <h2 class="mb-4">{{ board?.name || 'Проект' }}</h2>

    <div class="d-flex flex-row ga-4 board-columns">
      <div v-for="s in statuses" :key="s" class="flex-1">
        <h4>{{ s }}</h4>

        <draggable
            :list="tasksByStatus[s]"
            group="tasks"
            item-key="id"
            @end="onDragEnd"
            ghost-class="drag-ghost"
        >
          <template #item="{ element }">
            <v-card
                class="mb-2 pa-2 task-card cursor-grab"
                :color="priorityColor(element.priority)"
                @click="open(element)"
            >
              {{ element.title }}
            </v-card>
          </template>
        </draggable>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import draggable  from 'vuedraggable'
import { useBoardsStore }  from '@/stores/boards'
import { useIssuesStore }  from '@/stores/issues'
import { useUiStore }      from '@/stores/ui'
import type { IssueStatus } from '@/types'

const route        = useRoute()
const boardId      = Number(route.params.id)

const boardsStore  = useBoardsStore()
const issuesStore  = useIssuesStore()
const ui           = useUiStore()

const board = computed(() => boardsStore.boards.find(b => b.id === boardId))

onMounted(async () => {
  if (!board.value) await boardsStore.fetchBoards()
  await issuesStore.fetchBoardIssues(boardId)
})

const statuses: IssueStatus[] = ['Backlog','InProgress','Done']

const tasksByStatus = computed(() => {
  const map: Record<IssueStatus, any[]> = { Backlog:[], InProgress:[], Done:[] }
  issuesStore.currentBoardIssues.forEach(t => map[t.status].push(t))
  return map
})

const onDragEnd = async (e: any) => {
  const { element, to } = e
  const newStatus = to.parentElement.querySelector('h4').innerText.trim()
  if (element.status !== newStatus) {
    await issuesStore.updateIssueStatus(element.id, newStatus)
  }
}

const open = (task: any) => ui.openModal(task)
const priorityColor = (p: string) => p === 'Low' ? 'low' : p === 'Medium' ? 'medium' : 'high'
</script>

<style scoped>
.cursor-grab { cursor: grab; }

.drag-ghost {
  opacity: .6;
  transform: rotate(2deg);
}

@media (max-width:600px) {
  .board-columns { flex-direction: column; }
}
</style>
