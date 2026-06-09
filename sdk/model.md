# Модели данных

Модели — это основа работы с данными в <strong>Kodzero SDK</strong>. Они предоставляют объектно-ориентированный интерфейс для взаимодействия с коллекциями вашего бэкенда в стиле Active Record.

## Создание модели

### Базовый синтаксис

```js
const Product = kodzero.createModel({
  collection: 'products'
})
```

### С TypeScript-типами

```ts
// Определяем интерфейс данных
interface Product {
  _id: string | null
  title: string
  sku: string
  price: number
  status?: 'draft' | 'active' | 'archived'
  createdAt?: Date
  updatedAt?: Date
}

// Создаём типизированную модель
const Product = kodzero.createModel<Product>({
  collection: 'products'
})
```

### Со схемой валидации

>Для валидации данных используется пакет Validno. Подробнее: [validno.kodzero.pro](https://validno.kodzero.pro)

```js
const productSchema = {
  _id: { type: String },
  title: { type: String },
  sku: { type: String },
  price: { type: Number },
  status: { type: String, required: false }
}

const Product = kodzero.createModel<Product>({
  collection: 'products',
  schema: productSchema
})
```

## Работа с экземплярами
### Создание экземпляра

Рассмотрим пример создания новой записи в коллекции

```js
// Создание нового документа
const product = new Product({
  _id: null, // null для новых документов
  title: 'Беспроводные наушники',
  sku: 'WH-1000XM5',
  price: 29990
})

// На этом этапе запись еще не создана
// в коллекции, но мы можем посмотреть её 
// данные:

product.data()
// { _id: null, title: 'Беспроводные наушники', sku: 'WH-1000XM5', price: 29990 }

// Чтобы сохранить запись в коллекции
await product.save()
```

### save()
Сохраняет документ. Если `_id` не указан (или равен `null`), будет создан новый документ. Если `_id` есть — произойдет обновление существующего документа:

```js
// Новый документ (создание)
const product = new Product({
  _id: null,
  title: 'Беспроводные наушники',
  sku: 'WH-1000XM5',
  price: 29990
})

await product.save() // создаёт новую запись

console.log(product.data()._id) // теперь _id заполнен

// Обновление существующего документа
product.set('price', 27990)

await product.save() // обновляет запись по _id
```

#### create()
Явно создаёт новый документ:

```js
await product.create()
```

### update()
Явно обновляет существующий документ:

```js
await product.update()
```

::: warning
Метод `update()` требует наличия `_id`. Если `_id` отсутствует, будет выброшена ошибка.
:::

### delete()
Удаляет документ из коллекции:

```js
const deleted = await product.delete()

if (deleted) {
  console.log('Документ удалён')
}
```

### validate()
Валидирует данные по схеме (если схема была указана при создании модели):

```js
const result = product.validate()

if (result.ok) {
  console.log('Данные корректны')
} else {
  console.log('Ошибки:', result.joinErrors())
}
```

>Подробнее о механизме валидации: [validno.kodzero.pro](https://validno.kodzero.pro)

## Статические методы

Статические методы позволяют работать с коллекцией напрямую, без создания экземпляра.

### get(id)
Получает документ по ID и возвращает экземпляр модели:

```js
const product = await Product.get('product_id')

// product — это экземпляр модели с методами
product.set('price', 27990)
await product.save()
```

### find(id)
Получает документ по ID и возвращает простой объект:

```js
const productData = await Product.find('product_id')

// productData — это просто объект с данными
console.log(productData.title)
```

### findMany(options?)
Получает список документов:

```js
const products = await Product.findMany({
  page: 1,
  perPage: 25,
  search: 'Наушники',
  sort: '-createdAt',  // минус означает по убыванию
  fields: ['title', 'price']  // только указанные поля
})
```

**Параметры:**

| Параметр | Тип      | Описание                              |
|----------|----------|---------------------------------------|
| page     | number   | Номер страницы (начиная с 1)          |
| perPage  | number   | Количество документов на страницу      |
| search   | string   | Поисковый запрос                      |
| sort     | string   | Поле для сортировки (префикс - для убывания) |
| fields   | string[] | Список полей для возврата              |

### findManyPaginated(options?, page?, perPage?)
Получает список документов с информацией о пагинации:

```js
const result = await Product.findManyPaginated({}, 1, 25)

console.log(result.data)        // массив документов
console.log(result.state.page)  // текущая страница
console.log(result.state.total) // общее количество документов
```

Подробнее см. раздел «Пагинация».

### create(data)
Создаёт новый документ:

```js
const newProduct = await Product.create({
  title: 'Умная колонка',
  sku: 'SMART-SPEAKER-01',
  price: 12990
})

console.log(newProduct._id) // 'generated_id'
```

### update(id, data)
Обновляет документ по ID:

```js
const updatedProduct = await Product.update('product_id', {
  price: 11990
})
```

### delete(id)
Удаляет документ по ID:

```js
const deleted = await Product.delete('product_id')
// deleted: true
```

### distinct(field, options?)
Возвращает уникальные значения поля по фильтру.

```js
const categories = await Product.distinct('category')

console.log(categories) // ['audio', 'accessories']
```

## Полный пример

```js
// Импортируем Kodzero SDK
import Kodzero from 'kodzero-sdk'

// Создаём экземпляр клиента
const kodzero = new Kodzero({
  host: 'https://api.kodzero.pro/demo',
  authCollection: 'auth'
})

// Описываем интерфейс данных (TypeScript)
interface Product {
  _id: string | null
  title: string
  sku: string
  price: number
  status?: 'draft' | 'active' | 'archived'
}

// Описываем схему для валидации
const productSchema = {
  _id: { type: String },
  title: { type: String },
  sku: { type: String },
  price: { type: Number },
  status: { type: String, required: false }
}

// Создаём типизированную модель с валидацией
const Product = kodzero.createModel<Product>({
  collection: 'products',
  schema: productSchema
})

// Создаём новый экземпляр (документ)
const product = new Product({
  _id: null, // null для новых документов
  title: 'Беспроводные наушники',
  sku: 'WH-1000XM5',
  price: 29990,
  status: 'draft'
})

// Проверяем данные перед сохранением
const validation = product.validate()
if (!validation.ok) {
  // Выводим ошибки, если есть
  console.log('Ошибки:', validation.joinErrors())
}

// Сохраняем документ (создание)
await product.save()
console.log(product.data()._id) // теперь _id заполнен

// Изменяем данные
product.set('price', 27990)
product.set({ status: 'active' })

// Сохраняем изменения (обновление)
await product.save()

// Получаем документ по ID (экземпляр модели)
const foundProduct = await Product.get(product.data()._id)
console.log(foundProduct.data())

// Получаем документ по ID (простой объект)
const productData = await Product.find(product.data()._id)
console.log(productData.title)

// Получаем список документов
const products = await Product.findMany({
  page: 1,
  perPage: 10,
  search: 'Наушники',
  sort: '-_createdAt',
  fields: ['title', 'price']
})
console.log(products)

// Удаляем документ
const deleted = await product.delete()
if (deleted) {
  console.log('Документ удалён')
}
```