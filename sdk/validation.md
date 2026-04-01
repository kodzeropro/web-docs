# Валидация данных

Kodzero SDK предоставляет встроенную валидацию данных на основе собственной библиотеки [Validno](https://validno.kodzero.pro).

## Определение схемы

При создании модели укажите схему для валидации:

```js
const productSchema = {
  _id: { type: String },
  title: { type: String },
  sku: { type: String },
  price: { type: Number }
}

const Product = kodzero.createModel({
  collection: 'products',
  schema: productSchema
})
```

## Поддерживаемые типы

| Тип     | Описание         |
|---------|------------------|
| String  | Строка           |
| Number  | Число            |
| Boolean | Булево значение  |
| Date    | Дата             |
| Array   | Массив           |
| Object  | Объект           |

## Опции валидации

### required

```js

const schema = {
  name: { type: String, required: false } // required: false / true
}

// Отсутствие значения приравнивается к required: true
const schema2 = {
  name: { type: String } // required: true
}
```

### Другие опции

См. документацию [Validno](https://validno.kodzero.pro)


## Валидация экземпляра

### Метод `validate()`

Используйте метод `validate()` для проверки данных:

```js
const product = new Product({
  _id: null,
  title: 'Беспроводные наушники',
  price: null // значение отсутствует
})

const result = product.validate()

if (result.ok) {
  console.log('Данные корректны')
} else {
  console.log('Ошибки:', result.errors)
  console.log('Ошибки (строка):', result.joinErrors())
}
```

### Возвращаемое значение

```js
{
  ok: boolean,        // true если валидация прошла успешно
  errors: string[],   // массив ошибок
  joinErrors: () => string  // метод для объединения ошибок в строку
}
```

## Валидация без схемы

Если модель создана без схемы, метод `validate()` выбросит ошибку:

```js
const Product = kodzero.createModel<Product>({
  collection: 'products'
  // schema не указана
})

const product = new Product({ ... })
product.validate() // Error: No schema defined for validation
```