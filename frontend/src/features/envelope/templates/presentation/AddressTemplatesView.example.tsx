import React from 'react'
import { AddressTemplatesList } from './AddressTemplatesList'
import { useAddressTemplatesView } from '../application/hooks'
import type { EnvelopeRole } from '@shared/config/constants'

interface AddressTemplatesViewProps {
  type: EnvelopeRole
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
      console.error('Error:', error)
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
