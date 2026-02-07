<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
import type { CellValueChangedEvent, ColDef, RowDragEndEvent } from 'ag-grid-enterprise'

import type { RawItem } from '@/models/tree-store/types'

import { ACTIONS_BUTTON_TEXT, GROUP_LABEL, INITIAL_DATA, ITEM_LABEL } from './const'
import { getCategoryColumn, getEditableColumns, getViewColumns } from './columns'
import { getRowId } from './utils'
import { useModel } from './useModel'

import TableHeader from '../tree-header'
import TreeTable from '../tree-table'

// основной менеджер всего дерева

const {
  rows,
  isEditMode,
  toggleMode,
  getDataPath,
  addRow,
  removeRow,
  moveRowToParent,
  changeRowLabel,
  getChildren,
} = useModel(INITIAL_DATA)

const actionsRenderer = (params: any) => {
  const button = document.createElement('button')
  button.textContent = ACTIONS_BUTTON_TEXT
  button.classList.add('table-remove-button')
  button.onclick = () => {
    try {
      removeRow(params.data.id)
    } catch (error) {
      ElMessage.error('Ошибка при удалении: ' + error)
    }
  }
  return button
}

const columns = computed<ColDef[]>(() =>
  isEditMode.value ? getEditableColumns(actionsRenderer) : getViewColumns(),
)

const groupColumn = computed<ColDef>(() =>
  getCategoryColumn(isEditMode.value, (p) =>
    (getChildren(p.data).length > 0 ? GROUP_LABEL : ITEM_LABEL).toString(),
  ),
)

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
