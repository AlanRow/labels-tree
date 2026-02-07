import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import TreeTable from '../../components/tree-table/index.vue'

// по сути проверка простой обертки библиотечного компонента
// так что все проверки чисто на проброс пропсов и эмитов

const AgGridStub = {
  name: 'ag-grid-vue',
  props: [
    'treeData',
    'rowNumbers',
    'getRowId',
    'rowData',
    'columnDefs',
    'getDataPath',
    'autoGroupColumnDef',
  ],
  emits: ['rowDragEnd', 'cellValueChanged'],
  template: '<div />',
}

describe('TreeTable.vue', () => {
  it('forwards props to ag-grid-vue', () => {
    const fakeRowData = [{ id: 1, parent: null, label: 'Root' }]
    const fakeCols = [{ headerName: 'A' }]
    const fakeAuto = { headerName: 'Col' }
    const getRowId = (p: any) => String(p.data.id)
    const getDataPath = (i: any) => ['1']

    const wrapper = mount(TreeTable, {
      props: {
        rowData: fakeRowData,
        columnDefs: fakeCols,
        autoGroupColumnDef: fakeAuto,
        getRowId,
        getDataPath,
      },
      global: {
        components: { 'ag-grid-vue': AgGridStub },
      },
    })

    const ag = wrapper.findComponent(AgGridStub)
    expect(ag.exists()).toBe(true)
    expect(ag.props('rowData')).toEqual(fakeRowData)
    expect(ag.props('columnDefs')).toEqual(fakeCols)
    expect(ag.props('autoGroupColumnDef')).toEqual(fakeAuto)
    expect(ag.props('getRowId')).toEqual(getRowId)
    expect(ag.props('getDataPath')).toEqual(getDataPath)
  })

  it('passthroughs child events to parent emits', async () => {
    const wrapper = mount(TreeTable, {
      props: {
        rowData: [],
        columnDefs: [],
        autoGroupColumnDef: {},
        getRowId: () => '1',
        getDataPath: () => ['1'],
      },
      global: {
        components: { 'ag-grid-vue': AgGridStub },
      },
    })

    const ag = wrapper.findComponent(AgGridStub)

    const payloadDrag = { target: { data: { id: 1, label: 'test', parent: null } } }
    const payloadCellChanged = { label: 'new label' }

    ag.vm.$emit('rowDragEnd', payloadDrag)
    ag.vm.$emit('cellValueChanged', payloadCellChanged)

    expect(wrapper.emitted()).toHaveProperty('rowDragEnd')
    expect(wrapper.emitted()).toHaveProperty('cellValueChanged')
    expect(wrapper.emitted('rowDragEnd')?.[0]).toEqual([payloadDrag])
    expect(wrapper.emitted('cellValueChanged')?.[0]).toEqual([payloadCellChanged])
  })
})
