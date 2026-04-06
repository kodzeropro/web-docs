# Авторизация

::: tip :pushpin: Прежде чем начать
Для авторизации/аутентификации пользователя необходимо создать и настроить коллекцию специального типа — "Пользователи". Именно в ней будут храниться данные пользователей, а также осуществляться настройки авторизации.
:::

Модуль Auth в **Kodzero SDK** включает:

- базовые методы авторизации;
- методы стратегий авторизации:
    - стратегия Email/Password;
    - стратегия Email/OTP (one time password) `в разработке`
    - стратегия Яндекс OAuth `в разработке`
    - стратегия Telegram OAuth `в разработке`
- управление access/refresh токенами.

Для работы с коллекциями, доступность которых `User` или `Workspace` (см. [Уровни доступа коллекций](../collections/api-settings#уровни-доступа)), клиент **Kodzero SDK** должен быть авторизован.

<WhatAreTokens />

## Инициализация

При создании образца **Kodzero SDK** необходимо указать id коллекции, которая используется для работы с пользователями. Текущий образец будет использовать эту коллекцию для авторизации.

```ts
import Kodzero from 'kodzero-sdk'

const kodzero = new Kodzero({
    host: 'https://api.kodzero.pro/v1/10007', // хост + id вашего проекта
    authCollection: '100026', // id коллекции типа "Пользователи"
    autoRefreshToken: true // авто-обновление токенов при необходимости
})

export default kodzero
```

После инициализации пользователь не авторизован — токены пусты.

```
console.log(kodzero.tokensManager)
// TokensManagerClass { access: '', refresh: '' }

```

При необходимости вы можете создать два отдельных инстанса **Kodzero** с разными пользовательскими коллекциями.

```ts
import Kodzero from 'kodzero-sdk'

export const KodzeroByUser = new Kodzero({
    host: 'https://api.kodzero.pro/v1/10007',
    authCollection: '100001',
    autoRefreshToken: true
})

export const KodzeroByAdmin = new Kodzero({
    host: 'https://api.kodzero.pro/v1/10007',
    authCollection: '100000',
    autoRefreshToken: true
})

```

## Базовые методы и стратегии
При создании коллекции вы можете настроить разные способы аутентификации, которые называются стратегиями. 

Каждая стратегия предлагает свой набор методов, соответствующий выбранному протоколу (например, Email+пароль, OAuth, магическая ссылка). Однако независимо от выбранной стратегии, все методы делятся на две группы: базовые (доступны всегда) и специфичные (уникальные для конкретной стратегии).

::: tip Пример
Вход через **Email/Password** и вход через **OAuth** реализуются разными методами, но методы `verify`, `refresh` и `logout` остаются одинаковыми для обеих стратегий.
:::

## Базовые методы
Базовые методы могут быть вызваны вне зависимости от того, какие стратегии вы используете. 

### Проверка токена (verify)

Проверяет access-токен текущего пользователя (если вход уже был осуществлен).

```ts
const verifyResult = await kodzero.auth.email.verify()
console.log(verifyResult) // true / false
```

<b>Тип ответа:</b>
```ts
type VerifyResult = boolean
```

### Обновление токена (refresh)

Метод обновляет access-токен, используя текущий refresh-токен пользователя. Новый токен сразу же будет сохранен в текущем образце **Kodzero SDK**.

```ts
const result = await kodzero.auth.email.refresh()
```

<b>Тип ответа:</b>
```ts
type RefreshResult = {
    tokens: {
        access: string;
        refresh: string;
    }
}
```

#### Автоматическое обновление токена
Обратите внимание, что при инициализации можно активировать автоматическое обновление токенов:

``` ts {4}
const kodzero = new Kodzero({
    host: 'https://api.kodzero.pro/v1/10007/',
    authCollection: "100026",
    autoRefreshToken: true // ⬅️ автоматическое обновление токенов при необходимости
});
```

### Выход (logout)

Аннулирует токен. Также заканчивает сессию на стороне клиента (в образце **Kodzero**, в котором метод был вызван). После этого запросы текущего образца будут осуществляться как неавторизованные.

```ts
const logoutResult = await kodzero.auth.logout()
console.log(logoutResult) // true / false
```

<b>Тип ответа:</b>
```ts
type LogoutResult = boolean
```

## Стратегии: Email/Password

Для регистрации и входа используется адрес электронной почты и пароль.

### Вход (login)

Осуществляет вход пользователя в текущем образце **Kodzero SDK**. 

В случае успеха: Токены доступа сохраняются автоматически. Текущий образец **Kodzero SDK** готов к осуществлению запросов от лица пользователя (без необходимости добавлять токены в заголовок запроса).

```ts
const credentials = {
    email: 'user@example.com',
    password: 'StrongPassword123'
}

try {
    const loginResult = await kodzero.auth.email.login(credentials)
} catch (error) {
    console.log(error)
}
```

<b>Тип ответа:</b>

```ts
type LoginResult = {
    tokens: {
        access: string,
        refresh: string,
    },
    session: number,
    user: Record<string, unknown> // Данные пользователя
}
```

### Регистрация (register)

Регистрация пользователя и вход в созданную учётную запись в текущем образце **Kodzero SDK**.

В случае успеха: Токены доступа сохраняются автоматически. Текущий образец **Kodzero SDK** готов к осуществлению запросов от лица пользователя (без необходимости добавлять токены в заголовок запроса).

```ts
const credentials = {
    email: 'user@example.com',
    password: 'StrongPassword123',
    password2: 'StrongPassword123',
}

const registrationResult = await kodzero.auth.register(credentials)
```

<b>Тип ответа:</b>
```ts
type RegisterResult = {
    tokens: {
        access: string,
        refresh: string
    },
    session: number,
    user: { ... } // Данные пользователя
}
```

## Работа с токенами

### Ручное управление

При необходимости вы можете установить токены доступа или сбросить их вручную

```ts
kodzero.auth.setTokens(access, refresh || '')
kodzero.auth.clearTokens()
```

### Встроенный TokensManager

Позволяет безопасно работать с токенами текущего образца **Kodzero SDK**.

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

## Данные пользователя

Некоторые ответы включают данные пользователя: технические (обязательные) свойства, а также свойства, которые вы добавили в схеме коллекции.

```ts
interface AuthUser {
    // Технические автоматические поля:
    _id: string
    _identity: string
    _workspace: string
    _createdAt: string
    _updatedAt: string
    // Дополнительные поля вашей auth-коллекции:
    // ...
}
```

## Полный сценарий

```ts
// 1️⃣ Инициализация клиента
const kodzero = new Kodzero({
    host: 'https://api.kodzero.pro/v1/10007/',
    authCollection: "100026"
});

// Токены пустые, клиент не авторизован
console.log(kodzero.tokensManager)
// TokensManagerClass { access: '', refresh: '' }

console.log(kodzero.tokensManager.hasAccess())
// false
// ✅ access-токен отсутствует

// 2️⃣ Верификация текущего токена клиента на сервере
const verifyResult = await kodzero.auth?.email.verify();
console.log('token verified:', verifyResult)
// token verified: false
// ✅ Всё верно, вход не был выполнен

// 3️⃣ Регистрация нового пользователя
const credentials = {
    email: `new-user@test.com`,
    password: 'n3W-paSSw0rd'
}

const registerResult = await kodzero.auth?.email.register(credentials);
console.log('register result:', registerResult)
// register result: { tokens: { access: '...', refresh: '...' }, user: { ... }, session: 1 }
// ✅ Пользователь зарегистрирован и сразу же осуществлён вход

// 4️⃣ Проверка токена после регистрации
const verifyResult2 = await kodzero.auth?.email.verify();
console.log('token verified:', verifyResult2)
// token verified: true
// ✅ Клиент авторизован

console.log(kodzero.tokensManager)
// TokensManagerClass { access: '...', refresh: '...' }

// 5️⃣ Обновление текущего access-токена вручную
const refreshResult = await kodzero.auth?.email.refresh();
console.log('refresh result:', refreshResult)
// refresh result: { tokens: { access: '...', refresh: '...' } }
// ✅ Обновление токена выполнено успешно

// 6️⃣ Выход из учетной записи пользователя
const logoutResult = await kodzero.auth?.logout();
console.log('logout result:', logoutResult)
// logout result: true
// ✅ Выход из учётной записи выполнен

console.log(kodzero.tokensManager)
// TokensManagerClass { access: '', refresh: '' }
// Токены сброшены

// 7️⃣ Вход с данными, используемыми ранее для регистрации пользователя
const loginResult = await kodzero.auth?.email.login(credentials);
console.log('loginResult:', loginResult)
// loginResult: { tokens: { access: '...', refresh: '...' }, user: { ... }, session: 1 }
// ✅ Клиент успешно авторизован

// Любые запросы клиента (образца Kodzero SDK) будут осуществлены от лица текущего пользователя

// Например, создадим модель, связанную с коллекцией 100033:
const Task = kodzero.createModel({
  collection: '100033'
})

// Доступность коллекции `user`
// что означает, что для работы требуется авторизация

// Попробуем создать запись:
const newTask = new Task({title: 'Задача пользователя'})
await newTask.save()
// ✅ Запись создана
```


