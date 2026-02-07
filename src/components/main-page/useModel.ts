import { TreeStore } from '@/models'
import type { ItemId, RawItem } from '@/models/tree-store/types'
import type { ColDef, GetRowIdParams } from 'ag-grid-enterprise'
import { computed, ref } from 'vue'

import { v4 as uuidv4 } from 'uuid'
import { NEW_ITEM_LABEL } from './const'

export const useModel = (initialData?: RawItem[]) => {
  const tree = new TreeStore(initialData ?? [])
  const rows = ref<RawItem[]>(tree.getAll())

  const isEditMode = ref(false)
  function toggleMode() {
    isEditMode.value = !isEditMode.value
  }

  function updateRows() {
    rows.value = tree.getAll()
  }

  function addRow() {
    const newId = uuidv4()
    tree.addItem({
      id: newId,
      parent: null,
      label: NEW_ITEM_LABEL,
    })
    updateRows()
  }

  function removeRow(id: ItemId) {
    tree.removeItem(id)
    updateRows()
  }

  function changeRowLabel(id: ItemId, newLabel: string) {
    tree.updateItem({ id, label: newLabel })
    updateRows()
  }

  function moveRowToParent(row: RawItem, newParent: RawItem | null) {
    if (row.parent === newParent?.id) return

    tree.updateItem({ ...row, parent: newParent?.id ?? null })
    updateRows()
  }

  function getDataPath(item: RawItem): string[] {
    return tree
      .getAllParents(item.id)
      .map((parent) => parent.id.toString())
      .reverse()
  }

  function getRowId(params: GetRowIdParams<RawItem>): string {
    return params.data.id.toString()
  }

  function getChildren(item?: RawItem): RawItem[] {
    return item ? tree.getChildren(item.id) : []
  }

  return {
    // строки и колонки
    rows,
    // режим редактирования / просмотра
    isEditMode,
    toggleMode,
    // изменение таблицы
    addRow,
    changeRowLabel,
    moveRowToParent,
    removeRow,
    // геттеры
    getRowId,
    getDataPath,
    getChildren,
  }
}
