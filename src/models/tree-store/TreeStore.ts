import type { ChildNode, ItemId, RawItem, RootNode, RootRawItem, TreeNode } from './types'

export default class TreeStore {
  // мапа нам поможет быстро находить элементы по id
  // при этом за счет реализации JS она сама сохраняет
  // порядок добавления на двусвязных списках
  #idMap: Map<ItemId, TreeNode>

  // храним кэшированный список ради оптимизаций,
  // пересчитывая только при изменениях
  #cachedArray: RawItem[]
  // флаг для пересчета
  #isCacheValid: boolean

  /**
   * Создает новое дерево из массива элементов.
   *
   * @param data - Массив элементов дерева. Элементы должны образовывать корректную иерархию
   * @throws {Error} Если в данных не найден родительский элемент одного из узлов
   * @complexity O(n) - один проход по массиву плюс построение связей
   */
  constructor(data: RawItem[]) {
    // инициализируем кэш, не очень безопасно
    // (из-за возможности поменять внешний массив)
    // но экономим один обход массива
    this.#cachedArray = [...data]
    this.#isCacheValid = true

    // инициализируем внутреннюю мапу
    this.#idMap = new Map()

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

  /**
   * Проверяет является ли узел корневым элементом дерева.
   *
   * @param node - Узел для проверки
   * @returns true если узел корневой (parent === null), иначе false
   * @complexity O(1) - только проверка свойства
   */
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

  /**
   * Возвращает массив всех элементов дерева.
   *
   * Результат кэшируется и обновляется только при изменениях дерева.
   * @returns Копия всех элементов в порядке добавления в Map
   * @complexity O(n) - линейная при пересчете кэша, O(1) при валидном кэше
   */
  getAll(): RawItem[] {
    if (this.#isCacheValid) return this.#cachedArray

    const rawArray: RawItem[] = []

    // можно было бы использовать деструктуризацию с map
    // но по дороге бы пришлось создавать еще один массив
    for (const node of this.#idMap.values()) {
      rawArray.push(node.raw)
    }

    // восстанавливаем кэш
    this.#isCacheValid = true
    this.#cachedArray = rawArray
    return this.#cachedArray
  }

  /**
   * Получает элемент по его уникальному ID.
   *
   * @param id - Уникальный идентификатор элемента
   * @returns Элемент или undefined если не найден
   * @complexity O(1) - быстрый поиск по Map
   */
  getItem(id: ItemId): RawItem | undefined {
    return this.#getNode(id)?.raw
  }
  /**
   * Получает мгновенных потомков элемента (прямые дети, не глубже).
   *
   * @param id - ID родительского элемента
   * @returns Массив прямых потомков
   * @throws {Error} Если элемент с таким ID не найден
   * @complexity O(k) где k - количество прямых потомков
   */
  getChildren(id: ItemId): RawItem[] {
    const node = this.#getNode(id)
    if (node === undefined) throw new Error(`Элемент <${id}> не найден`)

    return node.childrenNodes.map((child) => child.raw)
  }
  /**
   * Получает всех потомков элемента рекурсивно (весь поддерево).
   *
   * Использует итеративный DFS вместо рекурсии для защиты от переполнения стека
   * на глубоких деревьях (глубина > 1000).
   * @param id - ID элемента, потомков которого нужно получить
   * @returns Массив всех потомков из поддерева
   * @throws {Error} Если элемент с таким ID не найден
   * @complexity O(m) где m - количество всех потомков (размер поддерева)
   */
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
  /**
   * Получает всех предков элемента (путь до корня дерева).
   *
   * Массив начинается с самого элемента и заканчивается корневым элементом.
   * @param id - ID элемента
   * @returns Массив предков от элемента до корня, включая сам элемент
   * @throws {Error} Если элемент с таким ID не найден
   * @complexity O(d) где d - глубина элемента в дереве
   */
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
  /**
   * Добавляет новый элемент в дерево.
   *
   * Если элемент имеет родителя, он связывается с существующим родителем.
   * Если это корневой элемент (parent === null), добавляется как независимое дерево.
   * @param item - Элемент с корректным ID и указанием родителя
   * @throws {Error} Если элемент с таким ID уже существует
   * @throws {Error} Если указан родитель, но он не найден в дереве
   * @complexity O(1) - добавление в Map и в массив детей родителя
   */
  addItem(item: RawItem): void {
    if (this.#idMap.has(item.id)) throw new Error(`Элемент <${item.id}> уже добавлен`)

    let node: TreeNode
    if (item.parent === null) {
      node = {
        raw: item,
        parentNode: null,
        childrenNodes: [],
      }
    } else {
      const parentNode = this.#getNode(item.parent)

      if (parentNode === undefined) throw new Error(`Родительский элемент ${item.parent} не найден`)

      node = {
        raw: item,
        parentNode,
        childrenNodes: [],
      }

      parentNode.childrenNodes.push(node)
    }

    this.#idMap.set(item.id, node)
    // возникают ошибки реактивности в таблице, если просто
    // добавлять элемент в кэш-массив, так что сбрасываю валидацию
    this.#isCacheValid = false
  }
  /**
   * Удаляет элемент и всех его потомков из дерева.
   *
   * Если элемент имеет родителя, он удаляется из списка детей родителя.
   * Все потомки удаляются из Map и становятся недоступны.
   * @param id - ID элемента для удаления
   * @throws {Error} Если элемент с таким ID не найден
   * @complexity O(n) где n - количество элементов в удаляемом поддереве
   */
  removeItem(id: ItemId): void {
    const node = this.#getNode(id)
    if (node === undefined) throw new Error(`Элемент <${id}> не обнаружен`)

    const { parentNode } = node

    if (parentNode !== null) {
      // у поддеревьев нет смысла удалять, они и так пропадут из доступа
      // а garbage collector'у V8 это не помешает их удалить, так что без утечек
      const childrenIndex = parentNode.childrenNodes.indexOf(node)
      parentNode.childrenNodes.splice(childrenIndex, 1)
    }

    this.#removeSubtreeRecursively(node)
    this.#isCacheValid = false
  }
  /**
   * Обновляет данные элемента, включая возможное изменение родителя.
   *
   * При изменении родителя проверяет циклы и корректирует связи в дереве.
   * Обновления применяются по ссылке, отражаясь везде где используется этот элемент.
   * @param newData - Объект с ID и частичными данными для обновления
   * @throws {Error} Если элемент не найден
   * @throws {Error} Если новый родитель не найден
   * @throws {Error} Если изменение родителя создает цикл
   * @complexity O(d) где d - глубина нового родителя при проверке на циклы
   */
  updateItem(newData: { id: ItemId } & Partial<RawItem>): void {
    const { id } = newData

    const node = this.#getNode(id)
    if (node === undefined) throw new Error(`Элемент <${id}> не обнаружен`)

    const oldData = node.raw

    if (oldData.parent !== newData.parent && newData.parent !== undefined) {
      if (oldData.parent !== null) {
        // если был другой родитель, то надо удалить элемент из списка детей
        const parentChildren = (node as ChildNode).parentNode.childrenNodes
        const nodeIndex = parentChildren.indexOf(node as ChildNode)
        parentChildren.splice(nodeIndex, 1)
      }

      if (newData.parent === null) {
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

    // обновляем по ссылке, так что везде отразится
    const updatedData = {
      ...oldData,
      ...newData,
    }
    node.raw = updatedData
    this.#isCacheValid = false
  }
}
