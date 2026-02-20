import React from 'react'
import type { AddressFields } from '@shared/config/constants'
import type { AddressTemplate } from '@entities/templates'
import styles from './AddressTemplatePreview.module.scss'

interface AddressTemplatePreviewProps {
  /** Шаблон адреса для отображения */
  template: AddressTemplate
  /** Компактный режим (только основные поля) */
  compact?: boolean
  /** Класс для кастомизации */
  className?: string
}

/**
 * Компонент для отображения превью шаблона адреса
 * Показывает основные поля адреса в читаемом формате
 */
export const AddressTemplatePreview: React.FC<AddressTemplatePreviewProps> = ({
  template,
  compact = false,
  className,
}) => {
  const { address, name } = template

  const formatAddress = (addr: AddressFields): string => {
    const parts: string[] = []
    
    if (addr.name) parts.push(addr.name)
    if (addr.street) parts.push(addr.street)
    if (compact) {
      // В компактном режиме показываем только город
      if (addr.city) parts.push(addr.city)
    } else {
      // В полном режиме показываем все поля
      if (addr.zip) parts.push(addr.zip)
      if (addr.city) parts.push(addr.city)
      if (addr.country) parts.push(addr.country)
    }
    
    return parts.filter(Boolean).join(', ')
  }

  return (
    <div className={`${styles.preview} ${className || ''}`}>
      {name && (
        <div className={styles.previewName}>{name}</div>
      )}
      <div className={styles.previewAddress}>
        {formatAddress(address)}
      </div>
      {!compact && (
        <div className={styles.previewMeta}>
          <span className={styles.previewId}>ID: {template.localId}</span>
          {template.serverId && (
            <span className={styles.previewServerId}>
              Server: {template.serverId}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
