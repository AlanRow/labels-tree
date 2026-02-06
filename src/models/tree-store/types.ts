export type ItemId = number | string

interface BaseRawItem {
  id: ItemId
  label: string
}

export interface RootRawItem extends BaseRawItem {
  parent: null
}

export interface ChildRawItem extends BaseRawItem {
  parent: ItemId
}

export type RawItem = RootRawItem | ChildRawItem

interface BaseTreeNode {
  // чтобы легко списки чайлдов выводить
  childrenNodes: ChildNode[]
}

export interface RootNode extends BaseTreeNode {
  raw: RootRawItem
  parentNode: null
}

export interface ChildNode extends BaseTreeNode {
  // чтобы отдавать данные в оригинальном виде быстро
  raw: ChildRawItem
  // чтобы легко находить родителя
  // можно было бы доставать через raw,
  // но для этого придется каждый раз лезть в мапу
  // а это в теории O(log n) и вообще дольше, чем ссылку хранить
  parentNode: TreeNode
}

export type TreeNode = RootNode | ChildNode
