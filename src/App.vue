<template>
  <router-view />
  <v-snackbar
      v-model="ui.snackbar.show"
      :color="ui.snackbar.type"
  >
    {{ ui.snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
const ui = useUiStore()
</script>
