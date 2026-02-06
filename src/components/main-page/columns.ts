import type { ItemId, RawItem } from '@/models/tree-store/types'
import type { AutoGroupColumnDef, ColDef } from 'ag-grid-enterprise'

// здесь генерируются колонки для таблицы

export function getReadonlyColumns(): ColDef[] {
  return [
    {
      headerName: 'Наименование',
      field: 'label',
    },
  ]
}

export function getEditableColumns(onDelete: (id: ItemId) => void): ColDef[] {
  return [
    {
      headerName: 'Наименование',
      field: 'label',
      editable: true,
    },
    {
      headerName: 'Действия',
      cellRenderer: (params: any) => {
        const button = document.createElement('button')
        button.textContent = 'Удалить'
        button.style.padding = '4px 8px'
        button.onclick = () => onDelete(params.data.id)
        return button
      },
      width: 100,
      pinned: 'right' as const,
    },
  ]
}

export function getCategoryColum(
  isEdit: boolean,
  valueGetter: (p: { data?: RawItem }) => string,
): AutoGroupColumnDef {
  return {
    headerName: 'Категория',
    valueGetter,
    rowDrag: isEdit,
  }
}
