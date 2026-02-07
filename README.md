# Тестовое задание: иерархическая таблица на Vue Ag Grid

Реализация тестового задания с оптимизацией TreeStore

## Установка зависимостей

```sh
npm install
```

### Запуск песочницы

```sh
npm run dev
```

### Сборка

```sh
npm run build
```

### Юнит-тесты

```sh
npm run test:unit
```

### Покрытие тестами

```sh
npm run test:coverage
```

### Экспорт TreeStore при помощи npm link

Для локально добавления зависимости в другой проект, он должен использовать TypeScript. Можно сделать это следующими командами:

1. Добавить зависимость:

```sh
npm link
```

2. Привязать в репозитории тестирования:

```sh
npm link labels-tree
```

3. Импортировать `TreeStore` в репозиторий для тестирования:

```ts
import { TreeStore } from 'labels-tree'

const store = new TreeStore([])
```
