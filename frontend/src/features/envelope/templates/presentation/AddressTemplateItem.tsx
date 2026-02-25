import React from 'react'
import { AddressTemplatePreview } from './AddressTemplatePreview'
import type { AddressTemplate } from '@entities/templates'
import styles from './AddressTemplateItem.module.scss'

interface AddressTemplateItemProps {
  template: AddressTemplate
  onSelect?: (template: AddressTemplate) => void
  onDelete?: (templateId: number | string) => void
  onEdit?: (template: AddressTemplate) => void
  isActive?: boolean
}

export const AddressTemplateItem: React.FC<AddressTemplateItemProps> = ({
  template,
  onSelect,
  onDelete,
  onEdit,
  isActive = false,
}) => {
  const handleSelect = () => {
    onSelect?.(template)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Удалить этот адрес?')) {
      onDelete?.(template.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(template)
  }

  return (
    <div
      className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
      onClick={handleSelect}
    >
      <div className={styles.itemContent}>
        <AddressTemplatePreview template={template} compact />
      </div>

      <div className={styles.itemActions}>
        {onEdit && (
          <button
            className={styles.itemAction}
            onClick={handleEdit}
            title="Редактировать"
            aria-label="Редактировать адрес"
          >
            ✎
          </button>
        )}
        {onDelete && (
          <button
            className={styles.itemAction}
            onClick={handleDelete}
            title="Удалить"
            aria-label="Удалить адрес"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
