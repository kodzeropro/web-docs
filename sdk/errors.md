# Обработка ошибок

Kodzero SDK предоставляет специальные классы ошибок для удобной обработки различных исключительных ситуаций.

## Типы ошибок

### KodzeroApiError
Возникает при ошибках API-запросов (4xx, 5xx ответы от сервера):

```ts
class KodzeroApiError extends Error {
  name: 'KodzeroApiError'
  url: string           // URL запроса
  statusCode: number    // HTTP код ответа
  message: string       // Сообщение об ошибке
  details: string       // Дополнительные детали
}
```

### KodzeroOptionsError
Возникает, если параметры (инпут) для создания или инициализации модели заданы некорректно (например, отсутствует обязательное поле или неверный тип параметра).

```ts
class KodzeroOptionsError extends Error {
  name: 'KodzeroValidationError'
  message: string       // Сообщение об ошибке
  errors: string[]      // Массив ошибок валидации
}
```

## Обработка ошибок API

### Базовый пример

```js
try {
  const invoice = await Invoice.get('non_existent_id')
} catch (error) {
  if (error.name === 'KodzeroApiError') {
    console.error('API ошибка:', error.message)
    console.error('HTTP код:', error.statusCode)
    console.error('URL:', error.url)
  } else {
    console.error('Неизвестная ошибка:', error)
  }
}
```

### Обработка по HTTP-кодам

```js
try {
  await kodzero.auth.login({ email, password })
} catch (error) {
  if (error.name === 'KodzeroApiError') {
    switch (error.statusCode) {
      case 400:
        // Неверный запрос
        alert('Проверьте введённые данные')
        break
      case 401:
        // Не авторизован
        alert('Неверный email или пароль')
        break
      case 403:
        // Доступ запрещён
        alert('Доступ запрещён')
        break
      case 404:
        // Не найдено
        alert('Документ не найден')
        break
      case 429:
        // Слишком много запросов
        alert('Слишком много попыток. Подождите.')
        break
      case 500:
        // Ошибка сервера
        alert('Ошибка сервера. Попробуйте позже.')
        break
      default:
        alert(`Ошибка: ${error.message}`)
    }
  }
}
```
