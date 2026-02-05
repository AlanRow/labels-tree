type ItemId = number | string

interface BaseRawItem {
  id: ItemId
  label: string
}

interface RootRawItem extends BaseRawItem {
  parent: null
}

interface ChildRawItem extends BaseRawItem {
  parent: ItemId
}

type RawItem = RootRawItem | ChildRawItem

interface BaseTreeNode {
  // чтобы легко списки чайлдов выводить
  childrenNodes: ChildNode[]
}

interface RootNode extends BaseTreeNode {
  raw: RootRawItem
  parentNode: null
}

interface ChildNode extends BaseTreeNode {
  // чтобы отдавать данные в оригинальном виде быстро
  raw: ChildRawItem
  // чтобы легко находить родителя
  // можно было бы доставать через raw,
  // но для этого придется каждый раз лезть в мапу
  // а это в теории O(log n) и вообще дольше, чем ссылку хранить
  parentNode: TreeNode
}

type TreeNode = RootNode | ChildNode

export class TreeStore {
  // мапа нам поможет быстро находить элементы по id
  // при этом за счет реализации JS она сама сохраняет
  // порядок добавления на двусвязных списках
  #idMap: Map<ItemId, TreeNode>
  // список корней нужен для удобства перебора дерева
  #roots: RootNode[]

  constructor(data: RawItem[]) {
    this.#idMap = new Map()
    this.#roots = []

    // для начала пробегаемся по массиву, чтобы индексировать значения и собрать корни
    data.forEach((item) => {
      const node: TreeNode = {
        raw: { ...item },
        parentNode: null,
        childrenNodes: [],
      }

      this.#idMap.set(item.id, node)

      if (TreeStore.checkNodeRoot(node)) {
        this.#roots.push(node)
      }
    })

    // теперь инциализируем ссылки внутри дерева
    this.#idMap.forEach((node, id) => {
      if (!TreeStore.checkNodeRoot(node)) {
        const parentId = node.raw.parent
        const parentNode = this.#idMap.get(parentId)

        if (parentNode === undefined) {
          throw new Error(`Ошибка при инициализации: не найден родительский элемент <${parentId}>`)
        }

        node.parentNode = parentNode
        parentNode.childrenNodes.push(node)
      }
    })
  }

  static checkNodeRoot(node: TreeNode): node is RootNode {
    return node.raw.parent === null
  }

  getAll(): RawItem[] {
    const rawArray: RawItem[] = []

    // можно было бы использовать деструктуризацию с map
    // но по дороге бы пришлось создавать еще один массив
    for (const node of this.#idMap.values()) {
      rawArray.push(node.raw)
    }

    return rawArray
  }

  getItem(id: ItemId): RawItem | undefined {
    throw Error('Not implemented')
  }
  getChildren(id: ItemId): RawItem[] {
    throw Error('Not implemented')
  }
  getAllChildren(id: ItemId): RawItem[] {
    throw Error('Not implemented')
  }
  getAllParents(id: ItemId): RawItem[] {
    throw Error('Not implemented')
  }
  addItem(item: RawItem): void {
    throw Error('Not implemented')
  }
  removeItem(id: ItemId): void {
    throw Error('Not implemented')
  }
  updateItem(newData: { id: ItemId } & Partial<RawItem>): void {
    throw Error('Not implemented')
  }
}
