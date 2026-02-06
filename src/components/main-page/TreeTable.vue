<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import type { CellValueChangedEvent, RowDragEndEvent, ColDef } from 'ag-grid-enterprise'
import type { RawItem } from '@/models/tree-store/types'
import type { AutoGroupColumnDef } from 'ag-grid-enterprise'
import { NUMBER_COL_WIDTH } from './const'

interface Props {
  rowData: RawItem[]
  columnDefs: ColDef[]
  autoGroupColumnDef: AutoGroupColumnDef
  getRowId: (params: any) => string
  getDataPath: (item: RawItem) => string[]
}

withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  (e: 'rowDragEnd', event: RowDragEndEvent): void
  (e: 'cellValueChanged', event: CellValueChangedEvent<RawItem>): void
}>()
</script>

<template>
  <ag-grid-vue
    treeData
    :rowNumbers="{ width: NUMBER_COL_WIDTH }"
    :get-row-id="getRowId"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :getDataPath="getDataPath"
    :autoGroupColumnDef="autoGroupColumnDef"
    class="table-grid"
    @row-drag-end="emit('rowDragEnd', $event)"
    @cell-value-changed="emit('cellValueChanged', $event)"
  />
</template>

<style scoped>
.table-grid {
  height: 600px;
}
</style>
