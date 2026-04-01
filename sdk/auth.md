# Авторизация

Модуль `auth` в SDK включает:

- базовые методы авторизации;
- стратегию `email + password`;
- управление access/refresh токенами.

## Инициализация

```ts
import Kodzero from 'kodzero-sdk'

const kodzero = new Kodzero({
    host: 'https://api.kodzero.pro/v1/10007',
    authCollection: '100026',
    autoRefreshToken: true
})

export default kodzero
```

## Тип данных пользователя

```ts
interface AuthUser {
    [ReservedKeyNames.ID]: string
    [ReservedKeyNames.Email]: string
    [ReservedKeyNames.Workspace]: string
    [ReservedKeyNames.CreatedAt]: string
    [ReservedKeyNames.UpdatedAt]: string
    name: string
    [key: string]: any
}
```

## Вход (Email + Password)

### Тип запроса

```ts
interface KodzeroAuthEmailLogin {
    email: string
    password: string
}
```

### Пример

```ts
const credentials: KodzeroAuthEmailLogin = {
    email: 'user@example.com',
    password: 'StrongPassword123'
}

const loginResult = await kodzero.auth.email.login(credentials)
```

### Тип ответа

```ts
{
    ok: true,
    result: {
        tokens: {
            access: accessToken,
            refresh: refreshToken,
        },
        session: sessionIndex,
        [RecordedKeysHumanizedMap[ReservedFieldKeysNamesAuth.User]]: userDataNoPassword,
    }
}
```

## Выход

```ts
await kodzero.auth.logout()
```

## Регистрация

### Тип запроса

```ts
export interface RegisterCredentials {
    email: string
    password: string
    password2: string
    name: string
}
```

### Пример

```ts
const credentials: RegisterCredentials = {
    email: 'user@example.com',
    password: 'StrongPassword123',
    password2: 'StrongPassword123',
    name: 'Иван'
}

const registrationResult = await kodzero.auth.register(credentials)
```

### Тип ответа

```ts
{ ok: true, result: ... }

const registerResult = {
    user: createdUser, // User data Record<string, unknown>
    tokens: loginResult.tokens, // {access: string, refresh: string }
    session: loginResult.session, // number
}
```

## Проверка токена (verify)

Проверяет токен из заголовка `Authorization: Bearer ***`.

### Пример

```ts
const verifyResult = (await kodzero.auth.email.verify()) as boolean
```

### Ожидаемый ответ

```ts
{ ok: true }
```

## Обновление токенов (refresh)

Метод запрашивает новую пару токенов.

### Пример

```ts
const result = await kodzero.auth.email.refresh()
```

### Ожидаемый input сервиса

```ts
const { refresh } = request.body
```

### Ожидаемый response сервиса

```ts
export type RefreshServiceResponse = Promise<{
    tokens: {
        access: string;
        refresh: string;
    }
}>
```

## Работа с токенами

### Ручное управление

```ts
kodzero.auth.setTokens(access, refresh || '')
kodzero.auth.clearTokens()
```

### Встроенный TokensManager

```ts
class TokensManagerClass {
    access: string
    refresh: string

    constructor(access: string = '', refresh: string = '') {
        this.access = access
        this.refresh = refresh
    }

    hasAccess() {
        return this.access && this.access !== ''
    }

    hasRefresh() {
        return this.refresh && this.refresh !== ''
    }

    setAccess(token: string) {
        this.access = token
    }

    setRefresh(token: string) {
        this.refresh = token
    }

    clear() {
        this.access = ''
        this.refresh = ''
    }
}
```

## Полный сценарий

```ts
const registrationResult = await kodzero.auth.register({
    email: 'user@example.com',
    password: 'StrongPassword123',
    password2: 'StrongPassword123',
    name: 'Иван'
})

const loginResult = await kodzero.auth.email.login({
    email: 'user@example.com',
    password: 'StrongPassword123'
})

kodzero.auth.setTokens(
    loginResult.result.tokens.access,
    loginResult.result.tokens.refresh
)

const verifyResult = await kodzero.auth.email.verify()

if (!verifyResult) {
    await kodzero.auth.email.refresh()
}

await kodzero.auth.logout()
kodzero.auth.clearTokens()
```


