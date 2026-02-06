import { describe, it, expect } from 'vitest'

import { useModel } from '../../../components/main-page/useModel'

describe('useModel.ts', () => {
  it('initializes rows and provides getters', () => {
    const initial = [
      { id: '1', parent: null, label: 'Root' },
      { id: 2, parent: '1', label: 'Child' },
    ]

    const model = useModel(initial as any)

    expect(model.rows.value).toEqual(initial)
    expect(model.getRowId({ data: initial[1] } as any)).toBe('2')
    expect(model.getDataPath(initial[1] as any)).toEqual(['1', '2'])
  })

  it('toggles edit mode and updates columns accordingly', () => {
    const model = useModel([{ id: 1, parent: null, label: 'Root' }] as any)

    expect(model.isEditMode.value).toBe(false)
    expect(model.columns.value).toHaveLength(1)

    model.toggleMode()

    expect(model.isEditMode.value).toBe(true)
    expect(model.columns.value).toHaveLength(2)
  })

  it('adds and removes rows', () => {
    const model = useModel([{ id: 1, parent: null, label: 'Root' }] as any)
    const before = model.rows.value.length

    model.addRow()
    expect(model.rows.value.length).toBe(before + 1)

    const added = model.rows.value.find((r: any) => r.label === 'Новый элемент')
    expect(added).toBeTruthy()

    model.removeRow(added.id)
    expect(model.rows.value.length).toBe(before)
  })

  it('changes label and moves row to new parent', () => {
    const initial = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const model = useModel(initial as any)

    model.changeRowLabel(2, 'Updated')
    expect(model.rows.value.find((r: any) => r.id === 2).label).toBe('Updated')

    const child = model.rows.value.find((r: any) => r.id === 2)
    model.moveRowToParent(child, null)
    expect(model.rows.value.find((r: any) => r.id === 2).parent).toBe(null)
  })
})
