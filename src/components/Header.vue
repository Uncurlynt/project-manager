<template>
  <v-app-bar app>
    <v-toolbar-title class="me-6">Task Manager</v-toolbar-title>

    <RouterLink to="/issues">
      <v-btn :color="isActive('/issues') ? 'primary' : 'secondary'" variant="text">
        Все задачи
      </v-btn>
    </RouterLink>
    <RouterLink to="/boards">
      <v-btn :color="isActive('/boards') ? 'primary' : 'secondary'" variant="text">
        Проекты
      </v-btn>
    </RouterLink>

    <v-spacer />

      <v-switch
          v-model="isDark"
          inset
          hide-details
          class="me-4"
          aria-label="Тёмная тема"
          false-icon="mdi-white-balance-sunny"
          true-icon="mdi-weather-night"
      />

    <v-btn text color="on-background" @click="openModal">
      Создать задачу
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { useTheme } from 'vuetify'
import { computed } from 'vue'

const route = useRoute()
const ui = useUiStore()

const openModal = () => ui.openModal()
// подсветка активного пункта меню
const isActive = (path: string) => route.path.startsWith(path)

const theme = useTheme()
const isDark = computed<boolean>({
  get:  () => theme.global.name.value === 'dark',
  set: (v) => theme.global.name.value = v ? 'dark' : 'light',
})
</script>
