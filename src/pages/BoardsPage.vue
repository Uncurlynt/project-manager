<template>
  <v-container>
    <v-card
      v-for="board in boards"
      :key="board.id"
      class="mb-4 d-flex align-center justify-space-between pa-4"
    >
      <div>
        <h3 class="mb-1">{{ board.name }}</h3>
        <small class="text-medium-emphasis">{{ board.description }}</small>
      </div>
      <v-btn variant="outlined" @click="go(board.id)">Перейти к доске</v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useBoardsStore } from '@/stores/boards'
import { useRouter } from 'vue-router'

const boardsStore = useBoardsStore()
const router = useRouter()

onMounted(() => {
  if (boardsStore.boards.length === 0) boardsStore.fetchBoards()
})

const boards = computed(() => boardsStore.boards)

const go = (id: number) => router.push(`/board/${id}`)
</script>
