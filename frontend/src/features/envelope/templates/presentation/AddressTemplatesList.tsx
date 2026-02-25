import React from 'react'
import { AddressTemplateItem } from './AddressTemplateItem'
import type { AddressTemplate } from '@entities/templates'
import type { EnvelopeRole } from '@shared/config/constants'
import styles from './AddressTemplatesList.module.scss'

interface AddressTemplatesListProps {
  templates: AddressTemplate[]
  type: EnvelopeRole
  isLoading?: boolean
  selectedId?: number | string | null
  onSelect?: (template: AddressTemplate) => void
  onEdit?: (template: AddressTemplate) => void
  emptyMessage?: string
  className?: string
}

export const AddressTemplatesList: React.FC<AddressTemplatesListProps> = ({
  templates,
  type,
  isLoading = false,
  selectedId,
  onSelect,
  onDelete,
  onEdit,
  emptyMessage,
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={`${styles.list} ${styles.listLoading} ${className || ''}`}
      >
        <div className={styles.listLoadingText}>Загрузка...</div>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className={`${styles.list} ${styles.listEmpty} ${className || ''}`}>
        <div className={styles.listEmptyText}>
          {emptyMessage ||
            `Нет сохраненных адресов для ${type === 'recipient' ? 'получателя' : 'отправителя'}`}
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.list} ${className || ''}`}>
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>
          {type === 'recipient' ? 'Получатели' : 'Отправители'} (
          {templates.length})
        </h3>
      </div>

      <div className={styles.listItems}>
        {templates.map((template) => (
          <AddressTemplateItem
            key={template.id}
            template={template}
            isActive={selectedId === template.id}
            onSelect={onSelect}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  )
}
