import React from 'react'
import { AddressTemplatesList } from './AddressTemplatesList'
import { useAddressTemplatesView } from '../application/hooks'
import type { EnvelopeRole } from '@shared/config/constants'

/**
 * Пример использования компонента списка шаблонов адресов
 * 
 * Использование:
 * ```tsx
 * <AddressTemplatesView type="recipient" />
 * <AddressTemplatesView type="sender" />
 * ```
 */
interface AddressTemplatesViewProps {
  /** Тип адреса (recipient/sender) */
  type: EnvelopeRole
  /** Обработчик выбора шаблона */
  onSelectTemplate?: (templateId: number | string) => void
}

export const AddressTemplatesView: React.FC<AddressTemplatesViewProps> = ({
  type,
  onSelectTemplate,
}) => {
  const {
    templates,
    isLoading,
    selectedTemplate,
    handleSelect,
    handleDelete,
    handleEdit,
  } = useAddressTemplatesView({
    type,
    onSaveSuccess: () => {
      console.log('Адрес успешно сохранен')
    },
    onError: (error) => {
      console.error('Ошибка:', error)
    },
  })

  const handleSelectWithCallback = (template: any) => {
    handleSelect(template)
    onSelectTemplate?.(template.id)
  }

  return (
    <AddressTemplatesList
      templates={templates}
      type={type}
      isLoading={isLoading}
      selectedId={selectedTemplate?.id}
      onSelect={handleSelectWithCallback}
      onDelete={handleDelete}
      onEdit={handleEdit}
      emptyMessage={`Нет сохраненных адресов для ${type === 'recipient' ? 'получателя' : 'отправителя'}`}
    />
  )
}
