<script setup lang="ts">
import { ElButton } from 'element-plus'

import { ADD_ROW_BUTTON_TEXT, EDIT_MODE_STATUS, VIEW_MODE_STATUS } from './const'

withDefaults(
  defineProps<{
    isEditMode: boolean
  }>(),
  {},
)

const emit = defineEmits<{
  (e: 'toggleMode'): void
  (e: 'addRow'): void
}>()
</script>

<template>
  <div class="header-row">
    <ElButton link type="primary" data-qa="mode-button" @click="emit('toggleMode')">
      {{ isEditMode ? EDIT_MODE_STATUS : VIEW_MODE_STATUS }}
    </ElButton>
    <ElButton v-if="isEditMode" type="success" data-qa="add-button" @click="emit('addRow')">{{
      ADD_ROW_BUTTON_TEXT
    }}</ElButton>
  </div>
</template>

<style scoped>
.header-row {
  margin-bottom: 1rem;
}
</style>
