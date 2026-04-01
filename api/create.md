# Create

Создание новой записи в коллекции.

## Запрос

```http
POST /v1/:project/:collection
Content-Type: application/json
```

## Тело запроса

JSON-объект с полями в соответствии со схемой коллекции:

```json
{
  "title": "Футболка",
  "price": 999
}
```

## Пример запроса

```http
POST https://api.kodzero.pro/v1/:project/:collection
Content-Type: application/json

{
  "title": "Футболка",
  "price": 999
}
```

## Ответ

```json
{
  "ok": true,
  "result": {
    "_id": "69c156e129d4e3fab000a265",
    "title": "Футболка",
    "price": 999,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**HTTP статус:** `201`

## Валидация

Данные проверяются на соответствие схеме коллекции:

- Типы полей
- Обязательные поля
- Ограничения (минимум, максимум, длина)

### Ошибка валидации

```json
{
  "ok": false,
  "error": "<string>"
}
```

**HTTP статус:** `400`

## Авторизация

Если метод защищён (scope: `User` или `Workspace`), передайте токен:

```http
POST /v1/:project/:collection
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Product"
}
```

При scope `User` запись автоматически привязывается к текущему пользователю.

При `Workspace` — к текущему workspace.
