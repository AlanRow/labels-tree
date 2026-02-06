<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { INITIAL_DATA } from './const'
import { useModel } from './useModel'
import type { CellValueChangedEvent, RowDragEndEvent } from 'ag-grid-enterprise'
import type { RawItem } from '@/models/tree-store/types'
import { ElButton, ElMessage } from 'element-plus'

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

// TODO: починить добавление
function onAddRow() {
  try {
    addRow()
  } catch (error) {
    ElMessage.error('Ошибка при добавлении: ' + error)
  }
}

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
  <div class="table-wrapper">
    <div class="header-row">
      <ElButton link type="primary" @click="toggleMode">
        {{ isEditMode ? 'Режим: редактирование' : 'Режим: просмотр' }}
      </ElButton>
      <ElButton v-if="isEditMode" type="success" @click="onAddRow">Добавить элемент</ElButton>
    </div>
    <ag-grid-vue
      treeData
      :rowNumbers="{ width: 80 }"
      :get-row-id="getRowId"
      :rowData="rows"
      :columnDefs="columns"
      :getDataPath="getDataPath"
      :autoGroupColumnDef="groupColumn"
      class="table-grid"
      @row-drag-end="onRowDragEnd"
      @cell-value-changed="onRowEdit"
    >
    </ag-grid-vue>
  </div>
</template>

<style scoped>
.table-wrapper {
  padding: 2em;
}
.header-row {
  margin-bottom: 1rem;
}
.table-grid {
  height: 600px;
}
</style>

<style lang="scss">
/** реализовал кнопку руками, т. к. протаскивать через Ag Grid Element Plus довольно муторно */
button.table-remove-button {
  background-color: rgb(236, 102, 102);
  color: white;
  border: none;
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  cursor: pointer;

  &:hover {
    background-color: rgb(241, 169, 169);
  }
}
</style>
