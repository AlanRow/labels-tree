import { describe, it, expect, vi } from 'vitest'

import {
  getReadonlyColumns,
  getEditableColumns,
  getCategoryColum,
} from '../../../components/main-page/columns'

// скорее сомнительно отношусь к подобным "интерфейсным" проверкам,
// которые часто будут ломаться, но около-UI код иначе не проверяется
describe('columns.ts', () => {
  it('returns readonly columns with correct shape', () => {
    const cols = getReadonlyColumns()

    expect(cols).toHaveLength(1)
    expect(cols[0].headerName).toBe('Наименование')
    expect(cols[0].field).toBe('label')
    expect(cols[0].flex).toBe(3)
  })

  it('editable columns include action cellRenderer that calls onDelete', () => {
    const onDelete = vi.fn()
    const cols = getEditableColumns(onDelete)

    const actionCol: any = cols.find((c) => c.headerName === 'Действия')
    expect(actionCol).toBeTruthy()

    const params = { data: { id: 'abc' } }
    const button = actionCol.cellRenderer(params) as HTMLButtonElement

    expect(button).toBeInstanceOf(HTMLButtonElement)
    expect(button.textContent).toBe('Удалить')
    expect(button.classList.contains('table-remove-button')).toBe(true)

    button.onclick && button.onclick(new PointerEvent('click'))
    expect(onDelete).toHaveBeenCalledWith('abc')
  })

  it('category column forwards valueGetter and respects isEdit rowDrag', () => {
    const valueGetter = (p: any) => (p.data && p.data.flag ? 'YES' : 'NO')
    const colEdit = getCategoryColum(true, valueGetter) as any
    const colView = getCategoryColum(false, valueGetter) as any

    expect(colEdit.rowDrag).toBe(true)
    expect(colView.rowDrag).toBe(false)
    expect(colEdit.flex).toBe(2)

    expect(colEdit.valueGetter({ data: { flag: true } })).toBe('YES')
    expect(colEdit.valueGetter({ data: { flag: false } })).toBe('NO')
  })
})
