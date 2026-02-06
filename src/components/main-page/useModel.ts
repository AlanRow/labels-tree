import { TreeStore } from '@/models'
import type { ItemId, RawItem } from '@/models/tree-store/types'
import type { ColDef, GetRowIdParams } from 'ag-grid-enterprise'
import { computed, ref } from 'vue'

import { v4 as uuidv4 } from 'uuid'
import { getCategoryColum, getEditableColumns, getReadonlyColumns } from './columns'

export const useModel = (initialData?: RawItem[]) => {
  // надо создавать rows до tree, чтобы сохранить реактивность при добавлении
  // (возможно, повлияет на производительность)
  const rows = ref(initialData ?? [])
  const tree = new TreeStore(rows.value)

  const columns = computed<ColDef[]>(() =>
    isEditMode.value ? getEditableColumns(removeRow) : getReadonlyColumns(),
  )

  const groupColumn = computed(() =>
    getCategoryColum(isEditMode.value, (p) =>
      (tree.getChildren(p.data?.id ?? 0).length > 0 ? 'Группа' : 'Элемент').toString(),
    ),
  )

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
      label: 'Новый элемент',
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

  return {
    // строки и колонки
    rows,
    columns,
    groupColumn,
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
  }
}
