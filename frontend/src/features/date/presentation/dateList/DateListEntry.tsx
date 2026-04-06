import React from 'react'
import clsx from 'clsx'
import type { CardStatus } from '@entities/postcard'
import { getToolbarIcon } from '@/shared/utils/icons'
import styles from './DateListEntry.module.scss'

export type DateListEntryVariant = 'default' | 'inactive'

export type DateListEntryProps = {
  /** Подпись даты (отправки, планируемой и т.д.) — сразу после превью. */
  dateLabel: string
  /** URL превью открытки; без URL показывается плейсхолдер. */
  previewUrl?: string | null
  /** Доп. строка: страна, имя, статус «отправлено» и т.п. (под сортировки позже). */
  detailLine?: string
  /** Неактивные строки (напр. одиночная дата в режиме мульти) — приглушённый вид. */
  variant?: DateListEntryVariant
  /** Цветной индикатор как у превью в календаре (перед миниатюрой). */
  previewStatus?: CardStatus
  onSelect?: () => void
  /** Удаление строки (как в адресной книге: кнопка видна при hover по строке). */
  onDelete?: () => void
  isStarred?: boolean
  onToggleStar?: () => void
  isSelected?: boolean
  isFocused?: boolean
}

export const DateListEntry: React.FC<DateListEntryProps> = ({
  dateLabel,
  previewUrl,
  detailLine,
  variant = 'default',
  previewStatus,
  onSelect,
  onDelete,
  isStarred = false,
  onToggleStar,
  isSelected = false,
  isFocused = false,
}) => {
  const interactive = Boolean(onSelect)
  const labelForAria = detailLine
    ? `${dateLabel}, ${detailLine}`
    : dateLabel

  return (
    <div
      className={styles.root}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-no-star={!onToggleStar ? 'true' : undefined}
      data-inactive={variant === 'inactive' ? 'true' : undefined}
      data-clickable={interactive ? 'true' : undefined}
      data-has-delete={onDelete ? 'true' : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? labelForAria : undefined}
      onClick={interactive ? () => onSelect?.() : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.()
              }
            }
          : undefined
      }
    >
      {onToggleStar ? (
        <button
          type="button"
          className={styles.star}
          data-starred={isStarred ? 'true' : undefined}
          onClick={(e) => {
            e.stopPropagation()
            onToggleStar()
          }}
          aria-label={
            isStarred ? 'Убрать из избранного' : 'Добавить в избранное'
          }
          title={isStarred ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          ★
        </button>
      ) : null}
      <div className={styles.body}>
        {previewStatus && previewStatus !== 'processed' ? (
          <span
            className={clsx(styles.statusIndicator, styles[previewStatus])}
            aria-hidden
          />
        ) : null}
        <div className={styles.thumb} aria-hidden>
          {previewUrl ? (
            <img src={previewUrl} alt="" className={styles.thumbImg} />
          ) : null}
        </div>
        <div className={styles.meta}>
          <div className={styles.dateLine}>{dateLabel}</div>
          {detailLine ? (
            <div className={styles.detailLine}>{detailLine}</div>
          ) : null}
        </div>
      </div>
      {onDelete ? (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="Удалить дату из списка"
          title="Удалить дату из списка"
        >
          {getToolbarIcon({ key: 'delete' })}
        </button>
      ) : null}
    </div>
  )
}
