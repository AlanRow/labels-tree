import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import TreeHeader from '../../../components/tree-header/index.vue'
import { EDIT_MODE_STATUS, VIEW_MODE_STATUS } from '../../../components/tree-header/const'

const ElButtonStub = {
  name: 'ElButton',
  props: ['link', 'type'],
  emits: ['click'],
  template: '<button @click="$emit(\'click\')"><slot /></button>',
}

describe('TreeHeader.vue', () => {
  it('default edit mode is false', async () => {
    const wrapper = mount(TreeHeader, {
      global: { components: { ElButton: ElButtonStub } },
    })

    expect(wrapper.props().isEditMode).toBe(false)
  })

  it('edit mode text when mode is OFF', async () => {
    const wrapper = mount(TreeHeader, {
      props: { isEditMode: false },
      global: { components: { ElButton: ElButtonStub } },
    })

    const modeBtn = wrapper.find('button[data-qa="mode-button"]')
    expect(modeBtn.text()).toBe(VIEW_MODE_STATUS)
  })

  it('edit mode text when mode is ON', async () => {
    const wrapper = mount(TreeHeader, {
      props: { isEditMode: true },
      global: { components: { ElButton: ElButtonStub } },
    })

    const modeBtn = wrapper.find('button[data-qa="mode-button"]')
    expect(modeBtn.text()).toBe(EDIT_MODE_STATUS)

    const addBtn = wrapper.find('button[data-qa="add-button"]')
    expect(addBtn.exists()).toBe(true)
  })

  it('change edit mode', async () => {
    const wrapper = mount(TreeHeader, {
      props: { isEditMode: false },
      global: { components: { ElButton: ElButtonStub } },
    })

    await wrapper.setProps({ isEditMode: true })

    const modeBtn = wrapper.find('button[data-qa="mode-button"]')
    const addBtn = wrapper.find('button[data-qa="add-button"]')

    expect(modeBtn.text()).toBe(EDIT_MODE_STATUS)
    expect(addBtn.exists()).toBe(true)

    await wrapper.setProps({ isEditMode: false })

    const updatedBtn = wrapper.find('button[data-qa="add-button"]')

    expect(modeBtn.text()).toBe(VIEW_MODE_STATUS)
    expect(updatedBtn.exists()).toBe(false)
  })

  it('fires "toggleMode" emit', async () => {
    const wrapper = mount(TreeHeader, {
      props: { isEditMode: false },
      global: { components: { ElButton: ElButtonStub } },
    })

    const modeBtn = wrapper.find('button[data-qa="mode-button"]')
    await modeBtn.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('toggleMode')
  })

  it('fires "addRow" emit', async () => {
    const wrapper = mount(TreeHeader, {
      props: { isEditMode: true },
      global: { components: { ElButton: ElButtonStub } },
    })

    const addBtn = wrapper.find('button[data-qa="add-button"]')
    await addBtn.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('addRow')
  })
})
