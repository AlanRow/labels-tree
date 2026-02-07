import { describe, it, expect } from 'vitest'

import { getRowId } from '../../../components/main-page/utils'

describe('getRowId', () => {
  it('simple string id', () => {
    const params = { data: { id: '1', parent: null, label: 'Root' } }
    expect(getRowId(params)).toBe('1')
  })
  it('number id', () => {
    const params = { data: { id: 1, parent: null, label: 'Root' } } as any
    expect(getRowId(params)).toBe('1')
  })
})
