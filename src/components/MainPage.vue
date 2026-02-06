<script setup lang="ts">
import { TreeStore } from '@/models'
import type { RawItem } from '@/models/tree-store/types'
import { AgGridVue } from 'ag-grid-vue3'
import { ref } from 'vue'

const initialData: RawItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

// TODO: move to model
const tree = new TreeStore(initialData)

const rowData = ref(tree.getAll())
const colDefs = ref([
  // {
  //   headerName: '№ п\п',
  //   pinned: 'left' as const,
  //   valueGetter: (p: { rowIndex?: number }) => (p.rowIndex ?? 0) + 1,
  //   width: 60,
  // },
  { headerName: 'Наименование', field: 'label' },
])

const autoGroupColumnDef = ref({
  headerName: 'Категория',
  valueGetter: (p: { data?: RawItem }) =>
    (tree.getChildren(p.data?.id ?? 0).length > 0 ? 'Группа' : 'Элемент').toString(),
})

function getItemPath(item: RawItem): string[] {
  return tree
    .getAllParents(item.id)
    .map((parent) => parent.label)
    .reverse()
}
</script>

<template>
  <!-- The AG Grid component -->
  <ag-grid-vue
    treeData
    rowNumbers
    :rowData="rowData"
    :columnDefs="colDefs"
    :getDataPath="getItemPath"
    :autoGroupColumnDef="autoGroupColumnDef"
    style="height: 500px"
  >
  </ag-grid-vue>
</template>
