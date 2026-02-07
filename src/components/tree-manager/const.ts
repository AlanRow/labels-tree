import type { RawItem } from '@/models/tree-store/types'

export const INITIAL_DATA: RawItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

// настройки таблицы
export const LABEL_COL_HEADER = 'Наименование'
export const LABEL_COL_FIELD = 'label'
export const LABEL_COL_FLEX = 3

export const CATEGORY_COL_FLEX = 2

export const ACTIONS_COL_HEADER = 'Действия'
export const ACTIONS_BUTTON_TEXT = 'Удалить'
export const ACTIONS_COLUMN_WIDTH = 120
export const ACTIONS_COLUMN_PINNED = 'right' as const

export const CATEGORY_HEADER = 'Категория'

export const GROUP_LABEL = 'Группа'
export const ITEM_LABEL = 'Элемент'
export const NEW_ITEM_LABEL = 'Новый элемент'
