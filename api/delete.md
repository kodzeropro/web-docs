# Delete

Удаление записи по идентификатору.

<UserCollectionApiNotice method="Delete" />

## Запрос

```http
DELETE /v1/:project/:collection/:id
```

| Параметр | Описание |
|----------|----------|
| `:id` | Уникальный идентификатор записи (`_id`) |

## Пример запроса

```http
DELETE https://api.kodzero.pro/v1/:project/:collection/:id
```

## Ответ

```json
{
  "ok": true,
  "result": {
    "deleted": true
  }
}
```

**HTTP статус:** `200`

::: warning Внимание
Удаление необратимо. Запись будет полностью удалена из базы данных без возможности восстановления.
:::

## Ошибки

### Запись не найдена

```json
{
  "ok": false,
  "error": "<string>"
}
```

**HTTP статус:** `404`
