<script setup lang="ts">
import { computed, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { INITIAL_DATA } from './const'
import { useModel } from './useModel'
import type { RowDragEndEvent } from 'ag-grid-enterprise'
import type { RawItem } from '@/models/tree-store/types'

const { rows, columns, groupColumn, isEditMode, toggleMode, getDataPath, addRow, moveRowToParent } =
  useModel(INITIAL_DATA)

function onAddRow() {
  try {
    addRow()
  } catch {
    // handle error
  }
}

function onRowDragEnd(event: RowDragEndEvent) {
  const target = event.overNode?.data as RawItem | undefined
  const source = event.node.data

  if (source === target || target?.id === source.parent) return

  try {
    moveRowToParent(source, target ?? null)
  } catch (error) {
    console.error('Move failed:', error)
  }
}
</script>

<template>
  <div>
    <div>
      <span @click="toggleMode" style="cursor: pointer; text-decoration: underline; color: #007bff">
        {{ isEditMode ? 'Режим: просмотр' : 'Режим: редактирования' }}
      </span>
    </div>
    <button v-if="isEditMode" @click="onAddRow">+ Добавить элемент</button>
    <!-- Fix auto closing after tree change (may be it will be with optimizitions) -->
    <ag-grid-vue
      treeData
      :rowNumbers="{ width: 80 }"
      :rowData="rows"
      :columnDefs="columns"
      :getDataPath="getDataPath"
      :autoGroupColumnDef="groupColumn"
      @row-drag-end="onRowDragEnd"
      style="height: 500px"
    >
    </ag-grid-vue>
  </div>
</template>
