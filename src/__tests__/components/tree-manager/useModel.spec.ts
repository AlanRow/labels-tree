import { describe, it, expect } from 'vitest'

import { useModel } from '../../../components/tree-manager/useModel'

describe('Get and change rows', () => {
  it('initializes with empty', () => {
    const model = useModel()
    expect(model.rows.value).toEqual([])
  })

  it('initializes with data', () => {
    const initialData = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const model = useModel(initialData)
    expect(model.rows.value).toEqual(initialData)
  })

  it('add new row to empty table', () => {
    const model = useModel()
    model.addRow()
    expect(model.rows.value).toHaveLength(1)
  })

  it('add new row to filled table', () => {
    const model = useModel([{ id: 1, parent: null, label: 'Root' }])
    model.addRow()
    expect(model.rows.value).toHaveLength(2)
  })

  it('add new row multiple times', () => {
    const model = useModel([{ id: 1, parent: null, label: 'Root' }])
    model.addRow()
    model.addRow()
    expect(model.rows.value).toHaveLength(3)
  })

  it('change row label', () => {
    const initialData = [{ id: 1, parent: null, label: 'Root' }]
    const model = useModel(initialData)
    model.changeRowLabel(1, 'New Root')
    expect(model.rows.value[0].label).toBe('New Root')
  })

  it('remove element row', () => {
    const initialData = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const model = useModel(initialData)
    model.removeRow(2)
    expect(model.rows.value).toHaveLength(1)
    expect(model.rows.value[0]).toEqual(initialData[0])
  })

  it('remove group row', () => {
    const initialData = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const model = useModel(initialData)
    model.removeRow(1)
    expect(model.rows.value).toHaveLength(0)
  })

  it('move row', () => {
    const initialData = [
      { id: 1, parent: null, label: 'Root 1' },
      { id: 2, parent: null, label: 'Root 2' },
      { id: 3, parent: 1, label: 'Child' },
    ]
    const model = useModel(initialData)
    model.moveRowToParent(initialData[2], initialData[1])
    expect(model.rows.value).toHaveLength(3)
    expect(model.rows.value[2].parent).toBe(2)
  })

  it('row parent is the same', () => {
    const initialData = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const model = useModel(initialData)
    model.moveRowToParent(initialData[1], initialData[0])
    expect(model.rows.value[1].parent).toBe(1)
  })

  it('move row to root', () => {
    const initialData = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const model = useModel(initialData)
    model.moveRowToParent(initialData[1], null)
    expect(model.rows.value[1].parent).toBe(null)
  })
})

describe('Edit mode', () => {
  it('init edit mode', () => {
    const model = useModel()
    expect(model.isEditMode.value).toBe(false)
  })

  it('toggle edit mode', () => {
    const model = useModel()
    model.toggleMode()
    expect(model.isEditMode.value).toBe(true)
    model.toggleMode()
    expect(model.isEditMode.value).toBe(false)
  })
})

describe('getters', () => {
  it('get data path', () => {
    const initialData = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const model = useModel(initialData)
    const path = model.getDataPath(initialData[1])
    expect(path).toEqual(['1', '2'])
  })

  it('get children', () => {
    const initialData = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
      { id: 3, parent: 1, label: 'Child 2' },
    ]
    const model = useModel(initialData)
    const children = model.getChildren(initialData[0])
    expect(children).toEqual([initialData[1], initialData[2]])
  })

  // этот случай нужен из-за требований внешнего типа,
  // но раз он возможен, то и проверить стоит
  it('get children for no node', () => {
    const initialData = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const model = useModel(initialData)
    const children = model.getChildren()
    expect(children).toEqual([])
  })
})
