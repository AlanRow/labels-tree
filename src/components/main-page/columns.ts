import type { ItemId, RawItem } from '@/models/tree-store/types'
import type { AutoGroupColumnDef, ColDef } from 'ag-grid-enterprise'
import {
  LABEL_COL_HEADER,
  LABEL_COL_FIELD,
  LABEL_COL_FLEX,
  ACTIONS_COL_HEADER,
  ACTIONS_BUTTON_TEXT,
  ACTIONS_COLUMN_WIDTH,
  ACTIONS_COLUMN_PINNED,
  CATEGORY_HEADER,
  CATEGORY_COL_FLEX,
} from './const'

// здесь генерируются колонки для таблицы

export function getViewColumns(): ColDef[] {
  return [
    {
      headerName: LABEL_COL_HEADER,
      field: LABEL_COL_FIELD,
      flex: LABEL_COL_FLEX,
      suppressHeaderMenuButton: true,
    },
  ]
}

export function getEditableColumns(onDelete: (id: ItemId) => void): ColDef[] {
  return [
    {
      headerName: LABEL_COL_HEADER,
      field: LABEL_COL_FIELD,
      editable: true,
      flex: LABEL_COL_FLEX,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: ACTIONS_COL_HEADER,
      // сделать компонентом
      cellRenderer: (params: any) => {
        const button = document.createElement('button')
        button.textContent = ACTIONS_BUTTON_TEXT
        button.classList.add('table-remove-button')
        button.onclick = () => onDelete(params.data.id)
        return button
      },
      width: ACTIONS_COLUMN_WIDTH,
      pinned: ACTIONS_COLUMN_PINNED,
      suppressHeaderMenuButton: true,
    },
  ]
}

export function getCategoryColum(
  isEdit: boolean,
  valueGetter: (p: { data?: RawItem }) => string,
): AutoGroupColumnDef {
  return {
    headerName: CATEGORY_HEADER,
    valueGetter,
    rowDrag: isEdit,
    flex: CATEGORY_COL_FLEX,
    suppressHeaderMenuButton: true,
  }
}
