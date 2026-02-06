import type { ItemId, RawItem } from '@/models/tree-store/types'
import type { AutoGroupColumnDef, ColDef } from 'ag-grid-enterprise'

// здесь генерируются колонки для таблицы

export function getReadonlyColumns(): ColDef[] {
  return [
    {
      headerName: 'Наименование',
      field: 'label',
      flex: 3,
      suppressHeaderMenuButton: true,
    },
  ]
}

export function getEditableColumns(onDelete: (id: ItemId) => void): ColDef[] {
  return [
    {
      headerName: 'Наименование',
      field: 'label',
      editable: true,
      flex: 3,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Действия',
      // сделать компонентом
      cellRenderer: (params: any) => {
        const button = document.createElement('button')
        button.textContent = 'Удалить'
        button.classList.add('table-remove-button')
        button.onclick = () => onDelete(params.data.id)
        return button
      },
      width: 120,
      pinned: 'right' as const,
      suppressHeaderMenuButton: true,
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
    flex: 2,
    suppressHeaderMenuButton: true,
  }
}
