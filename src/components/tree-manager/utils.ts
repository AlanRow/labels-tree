import type { RawItem } from '@/models/tree-store/types'
import type { GetRowIdParams } from 'ag-grid-enterprise'

export function getRowId(params: GetRowIdParams<RawItem>): string {
  return params.data.id.toString()
}
