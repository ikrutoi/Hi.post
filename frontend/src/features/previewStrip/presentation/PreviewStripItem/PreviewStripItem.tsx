import React from 'react'
import clsx from 'clsx'
import { CropPreviewItem } from '@/features/toolbar/presentation/CropPreviewItem'
import type { PreviewStripItemProps } from './PreviewStripItem.types'
import styles from './PreviewStripItem.module.scss'
import { capitalize } from '@/shared/utils/helpers'

export const PreviewStripItem: React.FC<PreviewStripItemProps> = ({ item }) => {
  if (item.kind === 'cardphoto') {
    return <CropPreviewItem cropId={item.imageId} />
  }

  if (item.kind === 'cardtext') {
    const snippet = item.plainText.slice(0, 30).trim()
    const text = snippet + (item.plainText.length > 30 ? '…' : '')
    return (
      <div className={styles.placeholder} title={item.plainText}>
        <span className={styles.placeholderText}>{text || 'Текст'}</span>
      </div>
    )
  }

  if (item.kind === 'address') {
    const label = item.addressType === 'sender' ? 'Sender' : 'Recipient'
    return (
      <div
        className={clsx(
          styles.placeholder,
          styles[`placeholder${capitalize(label)}`],
        )}
        title={`${label}: ${item.name}`}
      >
        {/* <span className={styles.placeholderLabel}>{label}</span> */}
        <span className={styles.placeholderText}>{item.name || '—'}</span>
      </div>
    )
  }

  return null
}
