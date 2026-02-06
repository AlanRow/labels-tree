import type { ChildNode, ItemId, RawItem, RootNode, RootRawItem, TreeNode } from './types'

export default class TreeStore {
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
      // немного ломаем типизацию через as TreeNode,
      // т. к. на стадии инициализации будет промежуточное "сломанное" состояние
      const node = {
        raw: { ...item },
        parentNode: null,
        childrenNodes: [],
      } as TreeNode

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

  // private functions
  #getNode(id: ItemId) {
    return this.#idMap.get(id)
  }
  #removeSubtreeRecursively(node: TreeNode) {
    this.#idMap.delete(node.raw.id)
    node.childrenNodes.forEach(this.#removeSubtreeRecursively.bind(this))
  }
  #removeFromRoots(node: RootNode) {
    const rootIndex = this.#roots.indexOf(node)
    this.#roots.splice(rootIndex, 1)
  }

  // TODO: probably is useless, delete it
  getRoots(): RootRawItem[] {
    return this.#roots.map((node) => node.raw)
  }

  // тут есть один проход по массиву и сложность O(n), но если хранить
  // оригинальный массив, то презко ухудшится удаление
  // TODO: add array caching, reset it only on delete or update parent
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
    return this.#getNode(id)?.raw
  }
  getChildren(id: ItemId): RawItem[] {
    const node = this.#getNode(id)
    if (node === undefined) throw new Error(`Элемент <${id}> не найден`)

    return node.childrenNodes.map((child) => child.raw)
  }
  getAllChildren(id: ItemId): RawItem[] {
    // можно было бы реализовать через рекурсию, но есть риск падения на переполнении стека
    // при глубине дерева больше 1000 с небольшим, так что идем поиском в глубину, т. к. в JS
    // push и pop быстрее shift и unshift
    const root = this.#getNode(id)
    if (root === undefined) throw new Error(`Элемент <${id}> не найден`)

    const result = []
    const nodesToSearch = [...root.childrenNodes]

    while (nodesToSearch.length > 0) {
      const node = nodesToSearch.pop() as TreeNode // всегда есть, проверили цсловием цикла
      result.push(node.raw)

      nodesToSearch.push(...node.childrenNodes)
    }

    return result
  }
  // TODO: is it make sense to add caching (and clear cache on update and delete)
  getAllParents(id: ItemId): RawItem[] {
    const node = this.#getNode(id)
    if (node === undefined) throw new Error(`Элемент <${id}> не найден`)

    const path = []
    let currentNode: TreeNode | null = node

    while (currentNode !== null) {
      path.push(currentNode)
      currentNode = currentNode.parentNode
    }

    return path.map((node) => node.raw)
  }
  addItem(item: RawItem): void {
    if (this.#idMap.has(item.id)) throw new Error(`Элемент <${item.id}> уже добавлен`)

    if (item.parent === null) {
      const node: RootNode = {
        raw: item,
        parentNode: null,
        childrenNodes: [],
      }

      this.#roots.push(node)
      this.#idMap.set(item.id, node)
    } else {
      const parentNode = this.#getNode(item.parent)

      if (parentNode === undefined) throw new Error(`Родительский элемент ${item.parent} не найден`)

      const node: ChildNode = {
        raw: item,
        parentNode,
        childrenNodes: [],
      }

      parentNode.childrenNodes.push(node)
      this.#idMap.set(item.id, node)
    }
  }
  removeItem(id: ItemId): void {
    const node = this.#getNode(id)
    if (node === undefined) throw new Error(`Элемент <${id}> не обнаружен`)

    const { parentNode } = node

    if (parentNode === null) {
      // вычищаем из списка рутов, если элемент был там
      this.#removeFromRoots(node)
    } else {
      // у поддеревьев нет смысла удалять, они и так пропадут из доступа
      // а garbage collector'у V8 это не помешает их удалить, так что без утечек
      const childrenIndex = parentNode.childrenNodes.indexOf(node)
      parentNode.childrenNodes.splice(childrenIndex, 1)
    }

    this.#removeSubtreeRecursively(node)
  }
  updateItem(newData: { id: ItemId } & Partial<RawItem>): void {
    const { id } = newData

    const node = this.#getNode(id)
    if (node === undefined) throw new Error(`Элемент <${id}> не обнаружен`)

    const oldData = node.raw

    // обновляем по ссылке, так что везде отразится
    const updatedData = {
      ...oldData,
      ...newData,
    }
    node.raw = updatedData

    if (oldData.parent !== newData.parent && newData.parent !== undefined) {
      if (oldData.parent === null) {
        // если это был корневой элемент, то надо его убрать из списка рутовых
        this.#removeFromRoots(node as RootNode)
      } else {
        // если был другой родитель, то надо удалить элемент из списка детей
        const parentChildren = (node as ChildNode).parentNode.childrenNodes
        const nodeIndex = parentChildren.indexOf(node as ChildNode)
        parentChildren.splice(nodeIndex, 1)
      }

      if (newData.parent === null) {
        // если это теперь корневой элемент, то надо добавить его в список рутовых
        this.#roots.push(node as RootNode)
        node.parentNode = null
      } else {
        // если элемент получил нового родителя, то надо добавить его в список детей
        const newParent = this.#getNode(newData.parent)
        if (newParent === undefined) {
          throw new Error(`Новый родительский элемент <${newData.parent}> не обнаружен`)
        }

        // проверим на предмет циклов
        let ancestor: TreeNode | null = newParent
        while (ancestor !== null) {
          if (ancestor.raw.id === oldData.id) throw new Error('Обнаружен цикл в новой структуре')
          ancestor = ancestor.parentNode
        }

        ;(node as ChildNode).parentNode = newParent
        newParent.childrenNodes.push(node as ChildNode)
      }
    }
  }
}
