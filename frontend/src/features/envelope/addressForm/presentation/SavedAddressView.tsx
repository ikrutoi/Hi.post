import React, { FocusEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import type { AddressFields } from '@shared/config/constants'
import styles from './SavedAddressView.module.scss'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateRecipientField } from '@envelope/recipient/infrastructure/state'
import { updateSenderField } from '@envelope/sender/infrastructure/state'
import { toolbarAction } from '@toolbar/application/helpers'

export type SavedAddressViewProps = {
  role: 'recipient' | 'sender'
  templateId: string
  address: AddressFields
}

type EditableRowKey = 'name' | 'street' | 'cityZip' | 'country'

export const SavedAddressView: React.FC<SavedAddressViewProps> = ({
  role,
  templateId,
  address,
}) => {
  const dispatch = useAppDispatch()
  const isEditMode = useAppSelector((state: any) => {
    const sel = state.envelopeSelection
    if (!sel) return false
    return role === 'sender'
      ? sel.savedSenderAddressEditMode
      : sel.savedRecipientAddressEditMode
  })

  const [activeRow, setActiveRow] = useState<EditableRowKey>('name')

  const nameRef = useRef<HTMLInputElement | null>(null)
  const streetRef = useRef<HTMLInputElement | null>(null)
  const zipRef = useRef<HTMLInputElement | null>(null)
  const cityRef = useRef<HTMLInputElement | null>(null)
  const countryRef = useRef<HTMLInputElement | null>(null)

  const cityZipValue = useMemo(() => {
    const parts = [address.zip, address.city].filter(Boolean)
    return parts.join(', ')
  }, [address.zip, address.city])

  const updateField = (field: keyof AddressFields, value: string) => {
    if (role === 'sender') {
      dispatch(updateSenderField({ field, value } as any))
    } else {
      dispatch(updateRecipientField({ field, value } as any))
    }
  }

  useEffect(() => {
    if (!isEditMode && activeRow !== 'name') {
      setActiveRow('name')
    }
  }, [isEditMode, activeRow])

  useEffect(() => {
    if (!isEditMode) return

    if (!activeRow) {
      setActiveRow('name')
      return
    }

    const map = {
      name: nameRef,
      street: streetRef,
      cityZip: zipRef,
      country: countryRef,
    } as const

    const input = map[activeRow].current
    if (input) {
      const len = input.value.length
      input.focus()
      input.setSelectionRange(len, len)
    }
  }, [isEditMode, role, activeRow])

  const moveFocus = (direction: 'up' | 'down', current: EditableRowKey) => {
    const order: EditableRowKey[] = ['name', 'street', 'cityZip', 'country']
    const idx = order.indexOf(current)
    if (idx === -1) return
    const nextIdx =
      direction === 'down'
        ? Math.min(order.length - 1, idx + 1)
        : Math.max(0, idx - 1)
    const nextKey = order[nextIdx]
    setActiveRow(nextKey)
  }

  const handleKeyDown =
    (row: EditableRowKey) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        moveFocus('down', row)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveFocus('up', row)
      }
    }

  const handleCityZipChange = (value: string) => {
    const [zipPart, ...cityParts] = value.split(',')
    const zip = zipPart?.trim() ?? ''
    const city = cityParts.join(',').trim()

    updateField('zip', zip)
    updateField('city', city)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget as HTMLElement | null
    if (next && next.tagName === 'INPUT') return

    const section =
      role === 'sender' ? 'senderSavedAddress' : 'recipientSavedAddress'
    dispatch(toolbarAction({ section, key: 'edit' } as any))
  }

  const renderViewMode = () => (
    <div
      className={clsx(
        styles.savedAddressView,
        role === 'sender'
          ? styles.savedAddressViewSender
          : styles.savedAddressViewRecipient,
      )}
    >
      <div className={styles.recipientAddress}>
        {address.name ? (
          <div className={styles.recipientAddressName}>{address.name}</div>
        ) : null}
        {address.street ? (
          <div className={styles.recipientAddressStreet}>{address.street}</div>
        ) : null}
        {[address.zip, address.city].filter(Boolean).length > 0 ? (
          <div className={styles.recipientAddressCityZip}>
            {[address.zip, address.city].filter(Boolean).join(', ')}
          </div>
        ) : null}
        {address.country ? (
          <div className={styles.recipientAddressCountry}>
            {address.country}
          </div>
        ) : null}
      </div>
    </div>
  )

  const renderEditMode = () => (
    <div
      className={clsx(
        styles.savedAddressView,
        role === 'sender'
          ? styles.savedAddressViewSender
          : styles.savedAddressViewRecipient,
      )}
      onMouseDown={(e) => {
        if (isEditMode) {
          const target = e.target as HTMLElement
          if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON') {
            e.preventDefault()
          }
        }
      }}
    >
      <div className={styles.recipientAddress}>
        {activeRow === 'name' ? (
          <input
            ref={nameRef}
            className={styles.recipientAddressInput}
            value={address.name}
            onChange={(e) => updateField('name', e.target.value)}
            onKeyDown={handleKeyDown('name')}
            onBlur={handleBlur}
          />
        ) : (
          <div className={styles.recipientAddressName}>{address.name}</div>
        )}

        {activeRow === 'street' ? (
          <input
            ref={streetRef}
            className={styles.recipientAddressInput}
            value={address.street}
            onChange={(e) => updateField('street', e.target.value)}
            onKeyDown={handleKeyDown('street')}
            onBlur={handleBlur}
          />
        ) : (
          <div className={styles.recipientAddressStreet}>{address.street}</div>
        )}

        {activeRow === 'cityZip' ? (
          <div className={styles.cityZipRow}>
            <input
              ref={zipRef}
              className={styles.recipientAddressInput}
              value={address.zip}
              onChange={(e) => updateField('zip', e.target.value)}
              onKeyDown={(e) => {
                // В пределах строки ZIP/CITY:
                // ArrowRight и ArrowDown двигают фокус к городу,
                // ArrowUp/Down для смены строки обрабатываются ниже.
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  if (cityRef.current) {
                    const len = cityRef.current.value.length
                    cityRef.current.focus()
                    cityRef.current.setSelectionRange(len, len)
                  }
                  return
                }
                // Остальное (ArrowUp и т.п.) — обычная навигация по строкам
                handleKeyDown('cityZip')(e)
              }}
              onBlur={handleBlur}
            />
            <span className={styles.cityZipSeparator}>,</span>
            <input
              ref={cityRef}
              className={styles.recipientAddressInput}
              value={address.city}
              onChange={(e) => updateField('city', e.target.value)}
              onKeyDown={(e) => {
                // ArrowLeft и ArrowUp возвращают фокус в ZIP в пределах строки.
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault()
                  if (zipRef.current) {
                    const len = zipRef.current.value.length
                    zipRef.current.focus()
                    zipRef.current.setSelectionRange(len, len)
                  }
                  return
                }
                // ArrowDown из города переходит на следующую строку (Country)
                handleKeyDown('cityZip')(e)
              }}
              onBlur={handleBlur}
            />
          </div>
        ) : (
          <div className={styles.recipientAddressCityZip}>{cityZipValue}</div>
        )}

        {activeRow === 'country' ? (
          <input
            ref={countryRef}
            className={styles.recipientAddressInput}
            value={address.country}
            onChange={(e) => updateField('country', e.target.value)}
            onKeyDown={handleKeyDown('country')}
            onBlur={handleBlur}
          />
        ) : (
          <div className={styles.recipientAddressCountry}>
            {address.country}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={styles.savedAddressViewContainer}>
      <div className={styles.savedAddressViewToolbar}>
        <Toolbar
          section={
            role === 'sender' ? 'senderSavedAddress' : 'recipientSavedAddress'
          }
        />
      </div>
      {isEditMode ? renderEditMode() : renderViewMode()}
    </div>
  )
}
