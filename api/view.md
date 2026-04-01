# View

Получение одной записи по её идентификатору.

## Запрос

```http
GET /v1/:project/:collection/:id
```

| Параметр | Описание |
|----------|----------|
| `:id` | Уникальный идентификатор записи (`_id`) |

## Пример запроса

```http
GET https://api.kodzero.pro/v1/:project/:collection/:id
```

## Ответ

```json
{
  "ok": true,
  "result": {
    "_id": "69c156e129d4e3fab000a264",
    "title": "Футболка",
    "price": 999,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

## Ошибки

### Запись не найдена

```json
{
  "ok": false,
  "error": "<string>"
}
```

**HTTP статус:** `404`

### Нет доступа

Если метод защищён (scope: `User` или `Workspace`) и токен не передан или недействителен:

```json
{
  "ok": false,
  "error": "<string>"
}
```

**HTTP статус:** `401`

При scope `User` запись автоматически привязывается к текущему пользователю.

При `Workspace` — к текущему workspace.
