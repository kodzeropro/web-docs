# Стратегии авторизации

Стратегия авторизации определяет, как пользователь подтверждает личность в коллекции типа «Пользователи».

В Kodzero методы авторизации делятся на две группы:

- базовые методы: работают одинаково для любой стратегии;
- специфичные методы: зависят от выбранной стратегии (например, Email/Password).

::: tip Пример
Вход через **Email/Password** и вход через **OAuth** реализуются разными методами, но методы `verify`, `refresh` и `logout` остаются одинаковыми для обеих стратегий.
:::

## Базовые методы

Базовые методы доступны независимо от выбранной стратегии.

### Проверка токена (`verify`)

Проверяет валидность текущего access-токена.

**Запрос:**

```http
POST https://api.kodzero.pro/:projectId/:collectionId/:strategy/verify
Authorization: Bearer ACCESS_TOKEN
```

**Успешный ответ:**

```json
{
    "ok": true
}
```

### Обновление токена (`refresh`)

Выдает новую пару токенов по действующему refresh-токену.

**Требования:**

- Заголовок `Content-Type: application/json`
- В body должен быть refresh-токен

**Запрос:**

```http
POST https://api.kodzero.pro/:projectId/:collectionId/:strategy/refresh
Content-Type: application/json

{
    "refresh": "REFRESH_TOKEN"
}
```

**Успешный ответ:**

```json
{
    "ok": true,
    "result": {
        "tokens": {
            "access": "string",
            "refresh": "string"
        }
    }
}
```

### Выход (`logout`)

Завершает текущую сессию пользователя и аннулирует токены.

**Требования:**

- Заголовок `Authorization: Bearer ACCESS_TOKEN`

**Запрос:**

```http
POST https://api.kodzero.pro/:projectId/:collectionId/:strategy/logout
Authorization: Bearer ACCESS_TOKEN
```
*body не требуется*

**Успешный ответ:**

```json
{
    "ok": true,
    "result": true
}
```

## Стратегия Email/Password

ID: `password`

Стандартная стратегия входа через email и пароль.

### Регистрация (`register`)

Создает нового пользователя и сразу же входит в учетную запись (возвращает данные сессии и токены).

**Требования:**

- Заголовок `Content-Type: application/json`

**Запроса:**

```http
POST https://api.kodzero.pro/:projectId/:collectionId/password/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "StrongPassword123",
    // плюс кастомные поля коллекции:
    "customField": "любое кастомное значение по схеме коллекции"
}
```

*Если схема коллекции предполагает кастомные поля, передайте их в body при регистрации.*

**Успешный ответ:**

```json
{
    "ok": true,
    "result": {
        "tokens": {
            "access": "string",
            "refresh": "string"
        },
        "session": 1,
        "user": {
            "_id": "string",
            "_identity": "user@example.com",
            "customField": "любое кастомное значение по схеме коллекции"

        }
    }
}
```

### Вход (`login`)

Авторизует существующего пользователя и возвращает токены.

**Требования:**

- Заголовок `Content-Type: application/json`

**Запрос:**

```http
POST https://api.kodzero.pro/:projectId/:collectionId/password/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "StrongPassword123"
}
```

**Успешный ответ:**

```json
{
    "ok": true,
    "result": {
        "tokens": {
            "access": "string",
            "refresh": "string"
        },
        "session": 1,
        "user": {
            "_id": "string",
            "_identity": "user@example.com"
        }
    }
}
```

::: info Подсказка
После `login` или `register` передавайте access-токен в заголовке:
`Authorization: Bearer ACCESS_TOKEN`
:::