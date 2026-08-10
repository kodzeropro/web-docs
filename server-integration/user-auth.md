# Аутентификация пользователей

В некоторых сценариях использования ваш кастомный сервер должен иметь возможность понять, какой пользователь инициирует запрос.

## Когда это необходимо
Аутентификация пользователя на сервере необходима, если **ваш кастомный endpoint** должен выполнять действия от имени конкретного пользователя.

Например, серверу может потребоваться:

* создать заказ для **текущего пользователя**;
* получить **данные пользователя** и использовать их в бизнес-логике;
* проверить **права пользователя** перед выполнением операции;
* связать созданные данные с **конкретным пользователем**, инициировавшим запрос.

## Как это работает

В Kodzero нет одного глобального verify-эндпоинта для всех проектов.

Проверка выполняется через verify-эндпоинт конкретной пользовательской коллекции, в которой вы ведете учет пользователей вашего приложения.

Пример URL:

```http
GET https://api.kodzero.pro/v1/:projectId/:collectionId/:strategy/verify
Authorization: Bearer ACCESS_TOKEN
```

Подробнее о методе: [Авторизация - Проверка токена (verify)](/auth/strategies#проверка-токена-verify).

## Алгоритм

```text
Frontend
    ↓ Authorization: Bearer USER_TOKEN
Ваш сервер
    ↓ Authorization: Bearer USER_TOKEN
Kodzero verify (ваша user-коллекция)
    ↓ _id, _identity
Ваш сервер
    ↓ бизнес-логика
    ↓ Authorization: Bearer ADMIN_API_KEY
    ↓ X-Kodzero-Profile: admin
Kodzero API 
```

## Пример проверки токена на сервере

### cURL

```bash
curl -X GET "https://api.kodzero.pro/v1/:projectId/:collectionId/:strategy/verify" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Node.js (fetch)

```js
const verifyResponse = await fetch(
  'https://api.kodzero.pro/v1/:projectId/:collectionId/:strategy/verify',
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  }
)

const verifyData = await verifyResponse.json()

if (!verifyData.ok) {
  return res.status(401).json({ message: 'Unauthorized user token' })
}

const kodzeroUser = verifyData.result
// kodzeroUser._id - ID пользователя
// kodzeroUser._identity - основная идентичность (например, email)
```

## Результат проверки через verify

Успешная проверка:

```json
{
  "ok": true,
  "result": {
    "_id": "123",
    "_identity": "user@example.com",
    "_workspace": "1234",
    "iat": 1111,
    "exp": 2222
  }
}
```

Неуспешная проверка:

```json
{
  "ok": false
}
```

## Дополнительная информация

- User Token подтверждает личность **конечного пользователя**.
- Admin API-ключ дает **вашему серверу** административный доступ к данным проекта.