# Кастомные методы

Kodzero SDK позволяет расширять модели собственными методами для реализации бизнес-логики.

## Регистрация метода

Используйте статический метод `registerMethod()` для добавления кастомных методов к модели:

```js
Invoice.registerMethod('markAsPaid', async function() {
  this.set('status', 'paid')
  this.set('paidAt', new Date())
  await this.update()
})
```

## Простой пример

```ts
interface Invoice {
  _id: string | null
  number: string
  customerName: string
  total: number
}

const Invoice = kodzero.createModel<Invoice>({
  collection: 'invoices'
})

// Регистрируем кастомный метод
Invoice.registerMethod('getSummary', function() {
  const data = this.data()
  return `Счёт ${data.number} для ${data.customerName} на ${data.total} ₽`
})

// Использование
const invoice = await Invoice.get('69c15092b84300bed74c5610')
console.log(invoice.getSummary()) // "Счёт INV-2026-014 для ООО Ромашка на 12500 ₽"
```

## Типизация кастомных методов

Для полной поддержки TypeScript создайте интерфейс для кастомных методов:

```ts
// Интерфейс данных
interface Invoice {
  _id: string | null
  number: string
  customerName: string
  total: number
  status: 'draft' | 'sent' | 'paid'
}

// Интерфейс кастомных методов
interface InvoiceMethods {
  getSummary: () => string
  isPaid: () => boolean
  applyDiscount: (percent: number) => number
}

// Создаём модель с обоими типами
const Invoice = kodzero.createModel<Invoice, InvoiceMethods>({
  collection: 'invoices'
})

// Регистрируем методы
Invoice.registerMethod('getSummary', function() {
  const data = this.data()
  return `Счёт ${data.number} для ${data.customerName}`
})

Invoice.registerMethod('isPaid', function() {
  return this.data().status === 'paid'
})

Invoice.registerMethod('applyDiscount', function(percent: number) {
  const total = this.data().total
  return total - (total * percent / 100)
})

// Теперь TypeScript знает о кастомных методах
const invoice = await Invoice.get('invoice_id')
invoice.getSummary()      // ✅ TypeScript знает тип возвращаемого значения
invoice.isPaid()         // ✅
invoice.applyDiscount(10) // ✅
// invoice.unknownMethod() // ❌ Ошибка компиляции
```

## Практические примеры

### Форматирование данных

```ts
interface Customer {
  _id: string | null
  firstName: string
  lastName: string
  phone: string
}

interface CustomerMethods {
  getFullName: () => string
  getInitials: () => string
  formatPhone: () => string
}

const Customer = kodzero.createModel<Customer, CustomerMethods>({
  collection: 'customers'
})

Customer.registerMethod('getFullName', function() {
  const { firstName, lastName } = this.data()
  return `${firstName} ${lastName}`
})

Customer.registerMethod('getInitials', function() {
  const { firstName, lastName } = this.data()
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
})

Customer.registerMethod('formatPhone', function() {
  const digits = this.data().phone.replace(/\D/g, '')
  return `+${digits}`
})
```

### Вычисляемые свойства

```ts
interface Order {
  _id: string | null
  items: Array<{ title: string; price: number; quantity: number }>
  discountPercent: number
}

interface OrderMethods {
  getSubtotal: () => number
  getDiscountAmount: () => number
  getTotal: () => number
  getItemCount: () => number
}

const Order = kodzero.createModel<Order, OrderMethods>({
  collection: 'orders'
})

Order.registerMethod('getSubtotal', function() {
  return this.data().items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
})

Order.registerMethod('getDiscountAmount', function() {
  const subtotal = this.getSubtotal()
  return subtotal * (this.data().discountPercent / 100)
})

Order.registerMethod('getTotal', function() {
  return this.getSubtotal() - this.getDiscountAmount()
})

Order.registerMethod('getItemCount', function() {
  return this.data().items.reduce((count, item) => count + item.quantity, 0)
})

// Использование
const order = await Order.get('order_id')
console.log('Подитог:', order.getSubtotal())
console.log('Скидка:', order.getDiscountAmount())
console.log('Итого:', order.getTotal())
console.log('Товаров:', order.getItemCount())
```

### Бизнес-логика

```ts
interface Task {
  _id: string | null
  title: string
  status: 'new' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
}

interface TaskMethods {
  isExpired: () => boolean
  requiresAttention: () => boolean
  getStatusLabel: () => string
}

const Task = kodzero.createModel<Task, TaskMethods>({
  collection: 'tasks'
})

Task.registerMethod('isExpired', function() {
  const { dueDate, status } = this.data()
  return Boolean(dueDate) && status !== 'done' && new Date(dueDate) < new Date()
})

Task.registerMethod('requiresAttention', function() {
  return this.data().priority === 'high' || this.isOverdue()
})

Task.registerMethod('getStatusLabel', function() {
  const labels = {
    new: 'Новая',
    in_progress: 'В работе',
    done: 'Завершена'
  }
  
  return labels[this.data().status]
})

// Использование
const tasks = await Task.findMany()
const urgentTasks = []
for (const taskData of tasks) {
  const task = await Task.get(taskData._id)
  if (task.requiresAttention()) urgentTasks.push(task)
}
```

## Доступ к данным в методах

Внутри кастомного метода:

- `this.data()` — получить текущие данные
- `this.set(key, value)` — изменить данные
- `this.save()` — сохранить изменения
- `this.update()` — обновить документ
- `this.delete()` — удалить документ
- `this.validate()` — валидировать данные

```ts
interface Invoice {
  _id: string | null
  status: 'draft' | 'sent' | 'paid'
  paidAt: string | null
  comment: string | null
}

interface InvoiceMethods {
  markAsPaid: (paidAt?: string) => Promise<void>
  canBePaid: () => boolean
}

const Invoice = kodzero.createModel<Invoice, InvoiceMethods>({
  collection: 'invoices'
})

Invoice.registerMethod('markAsPaid', async function() {
  this.set('status', 'paid')
  this.set('paidAt', new Date())
  this.set('comments', 'Оплата подтверждена автоматически')
  await this.update()
})

Invoice.registerMethod('canBePaid', function() {
  return this.data().status === 'sent'
})

// Использование
const invoice = await Invoice.get('69b91c2e39911ade31e65750')

if (invoice.canBePaid()) {
  await invoice.markAsPaid()
}
```
