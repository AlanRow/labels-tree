import { describe, it, expect, vi } from 'vitest'

import {
  getViewColumns,
  getEditableColumns,
  getCategoryColumn,
} from '../../../components/main-page/columns'

import { ACTIONS_COL_HEADER } from '../../../components/main-page/const'

// проверки максимально примитивные, но иначе онибудут ломаться при
// любом изменении контента, а так мы проверяем только ключевые моменты
describe('columns content', () => {
  it('returns readonly columns array, it more than 0', () => {
    const cols = getViewColumns()
    expect(Array.isArray(cols)).toBe(true)
    expect(cols.length).toBeGreaterThan(0)
  })

  it('editable columns has actions with cellRenderer', () => {
    const cellRenderer = vi.fn()
    const cols = getEditableColumns(cellRenderer)

    const actionCol: any = cols.find((c) => c.headerName === ACTIONS_COL_HEADER)
    expect(actionCol).toBeTruthy()
    expect(actionCol.cellRenderer).toBe(cellRenderer)
  })

  it('category column forwards valueGetter and respects isEdit rowDrag', () => {
    const valueGetter = (p: any) => (p.data && p.data.flag ? 'YES' : 'NO')
    const colEdit = getCategoryColumn(true, valueGetter) as any
    const colView = getCategoryColumn(false, valueGetter) as any

    expect(colEdit.rowDrag).toBe(true)
    expect(colView.rowDrag).toBe(false)
    expect(colEdit.flex).toBe(2)

    expect(colEdit.valueGetter({ data: { flag: true } })).toBe('YES')
    expect(colEdit.valueGetter({ data: { flag: false } })).toBe('NO')
  })
})
