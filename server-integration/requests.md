# Выполнение запросов с Admin API-ключом

Для выполнения запросов от имени администратора необходимо передать Admin API-ключ в заголовке `Authorization` и указать административный профиль с помощью заголовка `X-Kodzero-Profile`.

## Адрес запроса

Для серверной интеграции используется **тот же URL коллекции**, что и в обычном REST API-сценарии:

```text
https://api.kodzero.pro/v1/:project/:collection
```

Запрос переводится в административный маршрут только при наличии сочетания:

- `Authorization: Bearer <ADMIN_API_KEY>`
- `X-Kodzero-Profile: admin`

```http
Authorization: Bearer KODZERO_ADMIN_API_KEY_READ
X-Kodzero-Profile: admin
```

Заголовок `X-Kodzero-Profile: admin` сообщает Kodzero, что запрос должен быть выполнен с использованием административного профиля.

::: warning Важно
Если не передать `X-Kodzero-Profile: admin`, запрос не вернет `401` или `403` автоматически.

Он будет обработан как обычный запрос к стандартному REST API по этому же адресу.
:::

## cURL

### Получение данных

```bash
curl -X GET "https://api.kodzero.pro/v1/:project/:collection" \
  -H "Authorization: Bearer $KODZERO_ADMIN_API_KEY_READ" \
  -H "X-Kodzero-Profile: admin"
```

### Создание записи

```bash
curl -X POST "https://api.kodzero.pro/v1/:project/:collection" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $KODZERO_ADMIN_API_KEY_WRITE" \
  -H "X-Kodzero-Profile: admin" \
  -d '{"title":"New order","status":"pending"}'
```

## JavaScript (fetch)

```js
const response = await fetch(
  'https://api.kodzero.pro/v1/:project/:collection',
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.KODZERO_ADMIN_API_KEY_READ}`,
      'X-Kodzero-Profile': 'admin'
    }
  }
)

if (!response.ok) {
  throw new Error('Kodzero request failed')
}

const data = await response.json()
```

## Node.js

```js
const response = await fetch(
  'https://api.kodzero.pro/v1/:project/:collection',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KODZERO_ADMIN_API_KEY_WRITE}`,
      'Content-Type': 'application/json',
      'X-Kodzero-Profile': 'admin'
    },
    body: JSON.stringify(payload)
  }
)

if (!response.ok) {
  throw new Error('Kodzero request failed')
}

const data = await response.json()
```

::: tip 📌 Проверяйте ответ
Всегда проверяйте свойство `response.ok` перед обработкой ответа. В случае ошибки Kodzero возвращает JSON с описанием причины, который можно использовать для логирования или обработки в вашем приложении.
:::