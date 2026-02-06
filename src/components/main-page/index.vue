<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { INITIAL_DATA } from './const'
import { useModel } from './useModel'
import type { CellValueChangedEvent, RowDragEndEvent } from 'ag-grid-enterprise'
import type { RawItem } from '@/models/tree-store/types'
import { ElMessage } from 'element-plus'

const {
  rows,
  columns,
  groupColumn,
  isEditMode,
  toggleMode,
  getDataPath,
  getRowId,
  addRow,
  moveRowToParent,
  changeRowLabel,
} = useModel(INITIAL_DATA)

function onAddRow() {
  try {
    addRow()
  } catch (error) {
    ElMessage.error('Ошибка при добавлении: ' + error)
  }
}

// TODO: вынести стили в классы

function onRowDragEnd(event: RowDragEndEvent) {
  const target = event.overNode?.data as RawItem | undefined
  const source = event.node.data

  if (source === target || target?.id === source.parent) return

  try {
    moveRowToParent(source, target ?? null)
  } catch (error) {
    ElMessage.error('Ошибка при перемещении: ' + error)
  }
}

function onRowEdit(event: CellValueChangedEvent<RawItem>) {
  try {
    changeRowLabel(event.data.id, event.newValue)
  } catch (error) {
    ElMessage.error('Ошибка при перемещении: ' + error)
  }
}
</script>

<template>
  <div>
    <div>
      <span @click="toggleMode" style="cursor: pointer; text-decoration: underline; color: #007bff">
        {{ isEditMode ? 'Режим: редактирование' : 'Режим: просмотр' }}
      </span>
    </div>
    <button v-if="isEditMode" @click="onAddRow">+ Добавить элемент</button>
    <!-- TODO: Fix auto closing after tree change (may be it will be with optimizitions) -->
    <!-- TODO: добавить инпут для ввода чиселок -->
    <ag-grid-vue
      treeData
      :rowNumbers="{ width: 80 }"
      :get-row-id="getRowId"
      :rowData="rows"
      :columnDefs="columns"
      :getDataPath="getDataPath"
      :autoGroupColumnDef="groupColumn"
      @row-drag-end="onRowDragEnd"
      @cell-value-changed="onRowEdit"
      style="height: 500px"
    >
    </ag-grid-vue>
  </div>
</template>
