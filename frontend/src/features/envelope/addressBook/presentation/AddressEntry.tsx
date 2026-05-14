import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import styles from './AddressEntry.module.scss'
import { getToolbarIcon } from '@/shared/utils/icons'

type Props = {
  entry: AddressBookEntry
  onSelect: (entry: AddressBookEntry) => void
  /** Убрать адрес из списка получателей на конверте (иконка `clearInput` справа). */
  onRemoveFromList?: (id: string) => void
  isSelected?: boolean
  isFocused?: boolean
  variant?: 'sender' | 'recipient'
}

export const AddressEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onRemoveFromList,
  isSelected = false,
  isFocused = false,
  variant = 'recipient',
}) => {
  const { nameLine, cityCountryLine } = useMemo(() => {
    const name =
      entry.address.name?.trim() ||
      entry.label?.trim() ||
      ''
    const cityCountry = [entry.address.city, entry.address.country]
      .map((s) => s?.trim())
      .filter(Boolean)
      .join(', ')
    return {
      nameLine: name || '—',
      cityCountryLine: cityCountry || '—',
    }
  }, [entry.address.name, entry.address.city, entry.address.country, entry.label])

  const showRemove = Boolean(onRemoveFromList)

  return (
    <div
      className={clsx(styles.root, variant === 'sender' && styles.rootSender)}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-has-remove={showRemove ? 'true' : undefined}
    >
      <div className={styles.field} onClick={() => onSelect(entry)}>
        <div className={styles.nameLine}>{nameLine}</div>
        <div className={styles.cityLine}>{cityCountryLine}</div>
      </div>
      {showRemove ? (
        <button
          type="button"
          className={styles.removeFromListButton}
          aria-label="Remove from recipients list"
          title="Remove from recipients list"
          onClick={(e) => {
            e.stopPropagation()
            onRemoveFromList?.(entry.id)
          }}
        >
          {getToolbarIcon({ key: 'clearInput' })}
        </button>
      ) : null}
    </div>
  )
}
