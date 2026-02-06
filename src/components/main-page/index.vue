<script setup lang="ts">
import { INITIAL_DATA } from './const'
import { useModel } from './useModel'
import type { CellValueChangedEvent, RowDragEndEvent } from 'ag-grid-enterprise'
import type { RawItem } from '@/models/tree-store/types'
import { ElMessage } from 'element-plus'
import TableHeader from './TableHeader.vue'
import TreeTable from './TreeTable.vue'

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
    <TableHeader :isEditMode="isEditMode" @toggleMode="toggleMode" @addRow="onAddRow" />
    <TreeTable
      :rowData="rows"
      :columnDefs="columns"
      :autoGroupColumnDef="groupColumn"
      :getRowId="getRowId"
      :getDataPath="getDataPath"
      @rowDragEnd="onRowDragEnd"
      @cellValueChanged="onRowEdit"
    />
  </div>
</template>

<style scoped>
.table-wrapper {
  padding: 2em;
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
