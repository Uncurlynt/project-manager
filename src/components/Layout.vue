<template>
  <v-app>
    <Header />

    <v-main>
      <router-view />
    </v-main>

    <IssueModal />
  </v-app>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
import Header from './Header.vue'
import IssueModal from './IssueModal.vue'
import { useBoardsStore } from '@/stores/boards'

const boardsStore = useBoardsStore()
onMounted(() => boardsStore.fetchBoards())
</script>
