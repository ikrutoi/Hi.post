# Компоненты для работы с шаблонами адресов (секция Конверт)

Компоненты для просмотра и управления шаблонами адресов (recipient/sender) в секции Конверт.

## Структура

```
envelope/templates/
├── presentation/
│   ├── AddressTemplatePreview.tsx      # Превью адреса
│   ├── AddressTemplateItem.tsx         # Элемент списка
│   ├── AddressTemplatesList.tsx       # Список шаблонов
│   └── AddressTemplatesView.example.tsx # Пример использования
├── application/
│   └── hooks/
│       └── useAddressTemplatesView.ts  # Хук для управления
└── index.ts
```

## Использование

### Базовое использование

```tsx
import { AddressTemplatesList } from '@envelope/templates'
import { useAddressTemplatesView } from '@envelope/templates'

function EnvelopeTemplatesSection() {
  const {
    templates,
    isLoading,
    handleSelect,
    handleDelete,
    handleEdit,
  } = useAddressTemplatesView({
    type: 'recipient',
    onSaveSuccess: () => console.log('Сохранено'),
    onError: (error) => console.error(error),
  })

  return (
    <AddressTemplatesList
      templates={templates}
      type="recipient"
      isLoading={isLoading}
      onSelect={handleSelect}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  )
}
```

### Создание нового шаблона

```tsx
const { handleCreate } = useAddressTemplatesView({ type: 'recipient' })

await handleCreate({
  address: {
    name: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    zip: '10001',
    country: 'USA',
  },
  name: 'Home Address',
})
```

### Выбор шаблона для использования в открытке

```tsx
const { handleSelect } = useAddressTemplatesView({ type: 'recipient' })

const onSelectTemplate = (template: AddressTemplate) => {
  handleSelect(template)
  // Применить адрес к текущей открытке
  applyAddressToCard(template.address)
}
```

## Компоненты

### AddressTemplatePreview

Отображает превью адреса в компактном или полном формате.

**Props:**
- `template: AddressTemplate` - шаблон адреса
- `compact?: boolean` - компактный режим
- `className?: string` - дополнительный класс

### AddressTemplateItem

Элемент списка шаблонов с действиями (выбрать, редактировать, удалить).

**Props:**
- `template: AddressTemplate` - шаблон адреса
- `onSelect?: (template) => void` - обработчик выбора
- `onDelete?: (id) => void` - обработчик удаления
- `onEdit?: (template) => void` - обработчик редактирования
- `isActive?: boolean` - активен ли элемент

### AddressTemplatesList

Список всех шаблонов адресов указанного типа.

**Props:**
- `templates: AddressTemplate[]` - список шаблонов
- `type: EnvelopeRole` - тип адреса ('recipient' | 'sender')
- `isLoading?: boolean` - загружаются ли данные
- `selectedId?: number | string | null` - ID выбранного шаблона
- `onSelect?: (template) => void` - обработчик выбора
- `onDelete?: (id) => void` - обработчик удаления
- `onEdit?: (template) => void` - обработчик редактирования
- `emptyMessage?: string` - сообщение при пустом списке

## Хуки

### useAddressTemplatesView

Хук для управления состоянием и действиями со шаблонами адресов.

**Параметры:**
- `type: EnvelopeRole` - тип адреса
- `onSaveSuccess?: () => void` - обработчик успешного сохранения
- `onError?: (error: string) => void` - обработчик ошибок

**Возвращает:**
- `templates: AddressTemplate[]` - список шаблонов
- `isLoading: boolean` - загружаются ли данные
- `selectedTemplate: AddressTemplate | null` - выбранный шаблон
- `isSaving: boolean` - выполняется ли сохранение
- `handleSelect: (template) => void` - выбрать шаблон
- `handleCreate: (payload) => Promise<void>` - создать шаблон
- `handleUpdate: (id, payload) => Promise<void>` - обновить шаблон
- `handleDelete: (id) => Promise<void>` - удалить шаблон
- `handleEdit: (template) => void` - редактировать шаблон
- `reload: () => Promise<void>` - перезагрузить список

## Интеграция с бэкендом

При готовности бэкенда компоненты готовы к синхронизации:
- Поля `serverId`, `syncedAt`, `isDirty` уже присутствуют в типах
- `templateService` можно расширить методами синхронизации
- Компоненты автоматически отобразят данные из IndexedDB и бэкенда
