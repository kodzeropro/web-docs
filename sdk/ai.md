# Для ИИ-ассистентов

## Как использовать SDK с ИИ

Эта специально оптимизированная версия документации создана для быстрой интеграции с ИИ-ассистентами (ChatGPT, Claude, Copilot, Cursor). Она содержит только технические детали.

1. Скопируйте инструкцию ниже в свой AI-ассистент
2. Задайте конкретную задачу, например:
- "Сделай редактирование записи с Kodzero SDK"
- "Напиши CRUD операции для управления товарами"
- "Реализуй таблицу с данными всех заказов с пагинацией"

## Инструкция для ИИ

Скопируйте и вставьте инструкцию ИИ-ассистенту:

``` md
# Kodzero SDK — Quick Reference

## Install

npm i kodzero-sdk

## Init

import Kodzero from 'kodzero-sdk'

const cl = new Kodzero({
  host: 'https://api.kodzero.pro/v1/your-project',
  authCollection: '100001'
})

## Model

interface Record {
  _id: string | null
  name: string
  age: number
}

const RecordModel = kodzero.createModel<Record>({
  collection: 'records'
})

## CRUD Active Record

const record = new RecordModel({ _id: null, name: 'Test', age: 1 })
await record.create()              // Create
record.set('name', 'Testy').       // Set key
record.set({'name':'Testy',age:2}) // Set multiple key
await record.update()                // Update
await record.delete()              // Delete

## Static 

const found = await RecordModel.get('id') // Return model instance
const data = await RecordModel.find('id') // Return data object

const list = await RecordModel.findMany({ page: 1, perPage: 25, search: 'string', fields: ['key1','key2'], sort: '-_createdAt'})
// list: {"ok": true,"result": {"page": 1,"perPage": 25,"total": 0,"totalPages": 1,"found": []}}

const res = await RecordModel.findManyPaginated({}, 1, 25)
res.data        // items
res.state.page  // page number
await res.next() // next page
await res.previous() // previous page

## Validation

const schema = { name: { type: String }, age: { type: Number, required: false } } // required default = true 
const RecordModel = kodzero.createModel<Record>({ collection: 'records', schema })
const record = new RecordModel({ name: '', age: 2 })
const result = record.validate()
if (!result.ok) console.log(result.errors)

## Custom Methods

interface RecordMethods { isAdult: () => boolean }
const RecordModel = kodzero.createModel<Record, RecordMethods>({ collection: 'records' })
RecordModel.registerMethod('isAdult', function() { return this.data().age >= 12 })
const record = await RecordModel.get('id')
record.isAdult() // true/false

## Errors

try { await RecordModel.get('bad_id') }
catch (e) {
  if (e.name === 'KodzeroApiError') console.log(e.statusCode, e.message)
}
```

## Примеры промптов для разных задач

### ChatGPT/Claude/DeepSeek

``` md
Ты опытный JavaScript разработчик. Используй Kodzero SDK для реализации:

Задача: {опишите задачу}

Инструкция по SDK:
{copy-paste Инструкция для ИИ}
```

### GitHub Copilot

Добавьте в начале файла комментарий:

``` js
// Используй Kodzero SDK. Документация:
// {copy-paste Инструкция для ИИ}
```

Или предоставьте инструкцию при отправке промпта в чат.

### Локальная разработка с Cursor

Создайте файл .cursorrules в проекте:

``` js
{
  "kodzero": "Используй Kodzero SDK с фокусом на: create/read/update/delete операции, валидацию схемы, обработку ошибок"
}
```

### Промпт-шаблон

Более четкий промт для ИИ в виде шаблона:

``` md
## Контекст
SDK: Kodzero BaaS
Язык: TypeScript/JavaScript

## Требования
1. Используй только методы из официальной документации
2. Добавляй обработку ошибок для каждой операции
3. Используй TypeScript типы где возможно

## Задача
{ваша задача}

## Доступные методы
{copy-paste Инструкция для ИИ}
```

### Рекомендации

#### 1. Предоставляйте пример записи

```ts
// record example
// { "_id": "694d2de72f69bc65a83c42ce", "number": "INV-2026-014", "status": "sent", "total": 12500 }
```