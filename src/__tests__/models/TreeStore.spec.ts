import { describe, it, expect } from 'vitest'

import { TreeStore } from '../../models'

describe('Constructor & getAll()', () => {
  it('create empty', () => {
    const store = new TreeStore([])

    expect(store.getAll()).toEqual([])
  })
  it('create with data', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const store = new TreeStore(data)

    expect(store.getAll()).toEqual(data)
  })
  it('check order saving on unordeqred input', () => {
    const data = [
      { id: 2, parent: 1, label: 'Child' },
      { id: 1, parent: null, label: 'Root' },
    ]
    const store = new TreeStore(data)

    expect(store.getAll()).toEqual(data)
  })
  it('check tree is independent of origin array', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const store = new TreeStore(data)
    data.push({ id: 3, parent: 1, label: 'New Child' })

    expect(store.getAll()).toHaveLength(2)
    expect(store.getAll()).not.toEqual(data)
  })
})

describe('getItem()', () => {
  it('number id', () => {
    const data = [{ id: 1, parent: null, label: 'Root' }]
    const store = new TreeStore(data)

    expect(store.getItem(1)).toEqual(data[0])
  })
  it('string id', () => {
    const data = [{ id: 'root', parent: null, label: 'Root' }]
    const store = new TreeStore(data)

    expect(store.getItem('root')).toEqual(data[0])
  })
  it('ids "1" and 1', () => {
    const data = [
      { id: 1, parent: null, label: 'number' },
      { id: '1', parent: null, label: 'string' },
    ]
    const store = new TreeStore(data)

    expect(store.getItem(1)?.label).toBe('number')
    expect(store.getItem('1')?.label).toBe('string')
  })
  it('no existing id', () => {
    const data = [{ id: 1, parent: null, label: 'Root' }]
    const store = new TreeStore(data)

    expect(store.getItem(999)).toBeUndefined()
  })
})

describe('getChildren()', () => {
  it('leaf node with no children', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const store = new TreeStore(data)

    expect(store.getChildren(2).length).toBe(0)
  })
  it('parent with children', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child 1' },
      { id: 3, parent: 1, label: 'Child 2' },
    ]
    const store = new TreeStore(data)
    const children = store.getChildren(1)

    expect(children).toHaveLength(2)
    expect(children).toContainEqual(data[1])
    expect(children).toContainEqual(data[2])
  })
  it('parent with multulayer descendants', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
      { id: 3, parent: 2, label: 'Grandchild' },
    ]
    const store = new TreeStore(data)

    expect(store.getChildren(1)).toEqual([data[1]])
    expect(store.getChildren(2)).toEqual([data[2]])
  })
})

describe('getAllChildren()', () => {
  it('leaf node with no children', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const store = new TreeStore(data)

    expect(store.getAllChildren(2)).toEqual([])
  })
  it('parent with directly children', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child 1' },
      { id: 3, parent: 1, label: 'Child 2' },
    ]
    const store = new TreeStore(data)
    const allChildren = store.getAllChildren(1)

    expect(allChildren).toHaveLength(2)
    expect(allChildren).toContainEqual(data[1])
    expect(allChildren).toContainEqual(data[2])
  })
  it('parent with multulayer descendants', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
      { id: 3, parent: 2, label: 'Grandchild' },
      { id: 4, parent: 1, label: 'Child 2' },
    ]
    const store = new TreeStore(data)
    const allChildren = store.getAllChildren(1)
    expect(allChildren).toHaveLength(3)
    expect(allChildren).toContainEqual(data[1])
    expect(allChildren).toContainEqual(data[2])
    expect(allChildren).toContainEqual(data[3])
  })
})

describe('getAllParents()', () => {
  it('tree root with no parents', () => {
    const data = [{ id: 1, parent: null, label: 'Root' }]
    const store = new TreeStore(data)

    expect(store.getAllParents(1)).toEqual([data[0]])
  })
  it('child with root-parent', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
    ]
    const store = new TreeStore(data)
    const parents = store.getAllParents(2)

    expect(parents).toHaveLength(2)
    expect(parents).toEqual([data[1], data[0]])
  })
  it('child with line of ancestors', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
      { id: 3, parent: 2, label: 'Grandchild' },
    ]
    const store = new TreeStore(data)
    const parents = store.getAllParents(3)

    expect(parents).toHaveLength(3)
    expect(parents).toEqual([data[2], data[1], data[0]])
  })
})

describe('addItem()', () => {
  it('add item to empty tree', () => {
    const store = new TreeStore([])
    store.addItem({ id: 1, parent: null, label: 'Root' })

    expect(store.getItem(1)).toEqual({ id: 1, parent: null, label: 'Root' })
    expect(store.getAll()).toHaveLength(1)
  })
  it('add item to no-empty tree', () => {
    const data = [{ id: 1, parent: null, label: 'Root' }]
    const store = new TreeStore(data)
    store.addItem({ id: 2, parent: 1, label: 'Child' })

    expect(store.getItem(2)).toEqual({ id: 2, parent: 1, label: 'Child' })
    expect(store.getAll()).toHaveLength(2)
  })
  it('failed on add existing id', () => {
    const data = [{ id: 1, parent: null, label: 'Root' }]
    const store = new TreeStore(data)

    expect(() => {
      store.addItem({ id: 1, parent: null, label: 'Duplicate' })
    }).toThrow()
  })
})

describe('removeItem()', () => {
  it('remove leaf', () => {
    const data = [{ id: 1, parent: null, label: 'Root' }]
    const store = new TreeStore(data)
    store.removeItem(1)

    expect(store.getItem(1)).toBeUndefined()
    expect(store.getAll()).toHaveLength(0)
  })
  it('remove node with subtreee', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
      { id: 3, parent: 2, label: 'Grandchild' },
    ]
    const store = new TreeStore(data)
    store.removeItem(2)

    expect(store.getItem(2)).toBeUndefined()
    expect(store.getItem(3)).toBeUndefined()
    expect(store.getAll()).toHaveLength(1)
  })
  it('failed onremove non-existing item', () => {
    const store = new TreeStore([])

    expect(() => {
      store.removeItem(999)
    }).toThrow()
  })
})

describe('updateItem()', () => {
  it('update item label', () => {
    const data = [{ id: 1, parent: null, label: 'Root' }]
    const store = new TreeStore(data)
    store.updateItem({ id: 1, label: 'Updated Root' })

    expect(store.getItem(1)).toEqual({ id: 1, parent: null, label: 'Updated Root' })
  })
  it('update item parent', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: null, label: 'Another Root' },
    ]
    const store = new TreeStore(data)
    store.updateItem({ id: 2, parent: 1 })

    expect(store.getItem(2)).toEqual({ id: 2, parent: 1, label: 'Another Root' })
    expect(store.getChildren(1)).toEqual([{ id: 2, parent: 1, label: 'Another Root' }])
  })
  it('make item root', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
      { id: 3, parent: 2, label: 'Grandchild' },
    ]
    const store = new TreeStore(data)
    store.updateItem({ id: 3, parent: null })

    expect(store.getItem(3)).toEqual({ id: 3, parent: null, label: 'Grandchild' })
    expect(store.getAllParents(3)).toEqual([{ id: 3, parent: null, label: 'Grandchild' }])
    expect(store.getChildren(2)).toEqual([])
  })
  it('unchanged data', () => {
    const data = [{ id: 1, parent: null, label: 'Root' }]
    const store = new TreeStore(data)
    store.updateItem({ id: 1, parent: null, label: 'Root' })
    expect(store.getItem(1)).toEqual({ id: 1, parent: null, label: 'Root' })
  })
  it('failed on update non-existing item', () => {
    const store = new TreeStore([])

    expect(() => {
      store.updateItem({ id: 999, label: 'Non-existent' })
    }).toThrow()
  })
  it('failed on occurring cyclic structure', () => {
    const data = [
      { id: 1, parent: null, label: 'Root' },
      { id: 2, parent: 1, label: 'Child' },
      { id: 3, parent: 2, label: 'Grandchild' },
    ]
    const store = new TreeStore(data)

    expect(() => {
      store.updateItem({ id: 2, parent: 3 })
    }).toThrow()
  })
})

describe('Complex integration test', () => {
  it('Check all operations work together correctly', () => {
    const store = new TreeStore([
      { id: '1', parent: null, label: 'Root' },
      { id: 2, parent: '1', label: 'Child 1' },
    ])

    store.addItem({ id: '3', parent: '1', label: 'Child 2' })
    store.addItem({ id: 4, parent: 2, label: 'Grandchild' })
    store.addItem({ id: 5, parent: '3', label: 'Grandchild 2' })
    store.addItem({ id: 6, parent: 2, label: 'Grandchild 3' })
    store.updateItem({ id: 2, label: 'Updated Child 1' })
    store.updateItem({ id: 4, parent: '3', label: 'Updated Grandchild' })
    store.removeItem(2)
    store.removeItem(5)

    expect(store.getAll()).toEqual([
      { id: '1', parent: null, label: 'Root' },
      { id: '3', parent: '1', label: 'Child 2' },
      { id: 4, parent: '3', label: 'Updated Grandchild' },
    ])
  })
})
