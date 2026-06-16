import React, {
  FocusEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import type { AddressFields } from '@shared/config/constants'
import styles from './AddressView.module.scss'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectSenderViewEditMode,
  selectRecipientViewEditMode,
} from '@envelope/infrastructure/selectors'
import {
  updateAddressEditDraftField,
} from '@envelope/infrastructure/state'
import {
  updateRecipientField,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
} from '@envelope/sender/infrastructure/state'
import { toolbarAction } from '@toolbar/application/helpers'
import { getToolbarIcon } from '@/shared/utils/icons'

type AddressViewRole = 'recipient' | 'sender'

export type SenderViewProps = {
  templateId: string
  address: AddressFields
}

export type RecipientViewProps = {
  templateId: string
  address: AddressFields
}

type SingleAddressViewProps = {
  role: AddressViewRole
  templateId: string
  address: AddressFields
}

type EditableRowKey = 'name' | 'street' | 'cityZip' | 'country'
type CityZipFocus = 'zip' | 'city'

const SingleAddressView: React.FC<SingleAddressViewProps> = ({
  role,
  templateId,
  address,
}) => {
  const dispatch = useAppDispatch()
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const isEditMode =
    role === 'sender' ? senderViewEditMode : recipientViewEditMode

  const [activeRow, setActiveRow] = useState<EditableRowKey>('name')
  const [cityZipFocus, setCityZipFocus] = useState<CityZipFocus>('zip')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editModeOpenedAt = useRef<number>(0)

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
    if (isEditMode) {
      dispatch(updateAddressEditDraftField({ field, value }))
      return
    }
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
    const section = role === 'sender' ? 'senderView' : 'recipientView'
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target
      if (!(target instanceof Element)) return
      if (target.closest('[data-envelope-address-view-toolbar]')) {
        if (
          target.closest(
            'button[data-icon-key="addList"], button[data-icon-key="removeFromList"], button[data-icon-key="close"]',
          )
        ) {
          return
        }
        dispatch(toolbarAction({ section, key: 'edit' } as any))
        return
      }
      if (containerRef.current?.contains(target)) return
      if (
        target.closest(
          '[data-address-book-entry], [data-address-book-list], [data-envelope-address-fieldset], [data-envelope-address-delete]',
        )
      ) {
        return
      }
      dispatch(toolbarAction({ section, key: 'edit' } as any))
    }
    document.addEventListener('mousedown', handleMouseDown, true)
    return () => document.removeEventListener('mousedown', handleMouseDown, true)
  }, [isEditMode, role, dispatch])

  const focusActiveRowInput = () => {
    if (!isEditMode) return false

    let input: HTMLInputElement | null = null

    if (activeRow === 'cityZip') {
      const activeEl = document.activeElement
      if (activeEl === zipRef.current || activeEl === cityRef.current) {
        return true
      }
      input = cityZipFocus === 'city' ? cityRef.current : zipRef.current
    } else {
      const map = {
        name: nameRef,
        street: streetRef,
        country: countryRef,
      } as const
      input = map[activeRow].current
    }

    if (!input) return false

    editModeOpenedAt.current = Date.now()
    const len = input.value.length
    input.focus()
    input.setSelectionRange(len, len)
    return true
  }

  useLayoutEffect(() => {
    if (!isEditMode) return

    if (!activeRow) {
      setActiveRow('name')
      return
    }

    if (focusActiveRowInput()) return

    const raf = requestAnimationFrame(() => {
      focusActiveRowInput()
    })
    return () => cancelAnimationFrame(raf)
  }, [isEditMode, activeRow, cityZipFocus])

  const moveFocus = (direction: 'up' | 'down', current: EditableRowKey) => {
    const order: EditableRowKey[] = ['name', 'street', 'cityZip', 'country']
    const idx = order.indexOf(current)
    if (idx === -1) return
    const nextIdx =
      direction === 'down'
        ? Math.min(order.length - 1, idx + 1)
        : Math.max(0, idx - 1)
    const nextKey = order[nextIdx]
    if (nextKey === 'cityZip') {
      setCityZipFocus(direction === 'down' ? 'zip' : 'city')
    }
    setActiveRow(nextKey)
  }

  const activateEditRow = (
    row: EditableRowKey,
    cityZipPart: CityZipFocus = 'zip',
  ) => {
    if (row === 'cityZip') {
      setCityZipFocus(cityZipPart)
    }
    setActiveRow(row)
  }

  const editRowMouseDown = (
    row: EditableRowKey,
    cityZipPart: CityZipFocus = 'zip',
  ) => (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    activateEditRow(row, cityZipPart)
  }

  const handleKeyDown =
    (row: EditableRowKey) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (isEditMode) {
          dispatch(toolbarAction({ section: toolbarSection, key: 'edit' } as any))
        }
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const section =
          role === 'sender' ? 'senderView' : 'recipientView'
        dispatch(toolbarAction({ section, key: 'edit' } as any))
        return
      }
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
    // Don't toggle on unmount or when focus is lost to document (e.g. Strict Mode remount)
    if (!next) return
    if (next.tagName === 'INPUT') return
    if (next.closest('[data-address-edit-row]')) return
    if (next.closest('[data-envelope-address-view-toolbar]')) {
      if (
        !next.closest(
          'button[data-icon-key="addList"], button[data-icon-key="removeFromList"], button[data-icon-key="close"]',
        )
      ) {
        dispatch(toolbarAction({ section: toolbarSection, key: 'edit' } as any))
      }
      return
    }
    if (next.closest('[data-envelope-address-delete]')) return
    // Ignore blur shortly after opening edit (e.g. from list panel) so focus has time to land
    if (Date.now() - editModeOpenedAt.current < 200) return

    const section =
      role === 'sender' ? 'senderView' : 'recipientView'
    dispatch(toolbarAction({ section, key: 'edit' } as any))
  }

  const toolbarSection =
    role === 'sender' ? 'senderView' : 'recipientView'

  const handleFormDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(toolbarAction({ section: toolbarSection, key: 'delete' } as any))
  }

  const handleFormClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(toolbarAction({ section: toolbarSection, key: 'close' } as any))
  }

  const savedAddressViewClassName = clsx(
    styles.savedAddressView,
    !isEditMode && role !== 'sender' && styles.savedAddressViewWithFormActions,
    !isEditMode && role === 'sender' && styles.savedAddressViewWithCloseAction,
    role === 'sender'
      ? styles.savedAddressViewSender
      : styles.savedAddressViewRecipient,
  )

  const renderViewMode = () => (
    <div className={savedAddressViewClassName}>
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
      {role === 'sender' ? (
        <button
          type="button"
          className={styles.savedAddressCloseButton}
          data-envelope-address-close
          aria-label="Close"
          title="Close"
          onClick={handleFormClose}
        >
          {getToolbarIcon({ key: 'close' })}
        </button>
      ) : null}
      {role !== 'sender' ? (
        <button
          type="button"
          className={styles.savedAddressDeleteButton}
          data-envelope-address-delete
          aria-label="Delete address template"
          title="Delete template"
          onClick={handleFormDelete}
        >
          {getToolbarIcon({ key: 'delete' })}
        </button>
      ) : null}
    </div>
  )

  const renderEditMode = () => (
    <div
      className={savedAddressViewClassName}
      onMouseDown={(e) => {
        if (!isEditMode) return
        const target = e.target as HTMLElement
        if (target.closest('[data-address-edit-row]')) return
        if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON') {
          e.preventDefault()
        }
      }}
    >
      <div className={styles.recipientAddress}>
        {activeRow === 'name' ? (
          <input
            ref={nameRef}
            className={clsx(
              styles.recipientAddressInput,
              styles.recipientAddressInputActive,
            )}
            value={address.name}
            onChange={(e) => updateField('name', e.target.value)}
            onKeyDown={handleKeyDown('name')}
            onBlur={handleBlur}
          />
        ) : (
          <div
            className={clsx(
              styles.recipientAddressName,
              styles.recipientAddressEditRow,
            )}
            data-address-edit-row
            onMouseDown={editRowMouseDown('name')}
          >
            {address.name}
          </div>
        )}

        {activeRow === 'street' ? (
          <input
            ref={streetRef}
            className={clsx(
              styles.recipientAddressInput,
              styles.recipientAddressInputActive,
            )}
            value={address.street}
            onChange={(e) => updateField('street', e.target.value)}
            onKeyDown={handleKeyDown('street')}
            onBlur={handleBlur}
          />
        ) : (
          <div
            className={clsx(
              styles.recipientAddressStreet,
              styles.recipientAddressEditRow,
            )}
            data-address-edit-row
            onMouseDown={editRowMouseDown('street')}
          >
            {address.street}
          </div>
        )}

        {activeRow === 'cityZip' ? (
          <div className={styles.cityZipRow}>
            <input
              ref={zipRef}
              className={clsx(
                styles.recipientAddressInput,
                cityZipFocus === 'zip' && styles.recipientAddressInputActive,
              )}
              value={address.zip}
              onChange={(e) => updateField('zip', e.target.value)}
              onFocus={() => setCityZipFocus('zip')}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setCityZipFocus('city')
                  if (cityRef.current) {
                    const len = cityRef.current.value.length
                    cityRef.current.focus()
                    cityRef.current.setSelectionRange(len, len)
                  }
                  return
                }
                handleKeyDown('cityZip')(e)
              }}
              onBlur={handleBlur}
            />
            <span className={styles.cityZipSeparator}>,</span>
            <input
              ref={cityRef}
              className={clsx(
                styles.recipientAddressInput,
                cityZipFocus === 'city' && styles.recipientAddressInputActive,
              )}
              value={address.city}
              onChange={(e) => updateField('city', e.target.value)}
              onFocus={() => setCityZipFocus('city')}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setCityZipFocus('zip')
                  if (zipRef.current) {
                    const len = zipRef.current.value.length
                    zipRef.current.focus()
                    zipRef.current.setSelectionRange(len, len)
                  }
                  return
                }
                handleKeyDown('cityZip')(e)
              }}
              onBlur={handleBlur}
            />
          </div>
        ) : (
          <div
            className={clsx(
              styles.recipientAddressCityZip,
              styles.recipientAddressEditRow,
            )}
            data-address-edit-row
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const ratio = (e.clientX - rect.left) / rect.width
              editRowMouseDown(
                'cityZip',
                ratio > 0.4 ? 'city' : 'zip',
              )(e)
            }}
          >
            {cityZipValue}
          </div>
        )}

        {activeRow === 'country' ? (
          <input
            ref={countryRef}
            className={clsx(
              styles.recipientAddressInput,
              styles.recipientAddressInputActive,
            )}
            value={address.country}
            onChange={(e) => updateField('country', e.target.value)}
            onKeyDown={handleKeyDown('country')}
            onBlur={handleBlur}
          />
        ) : (
          <div
            className={clsx(
              styles.recipientAddressCountry,
              styles.recipientAddressEditRow,
            )}
            data-address-edit-row
            onMouseDown={editRowMouseDown('country')}
          >
            {address.country}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div
      data-envelope-address-surface
      data-envelope-address-view-mode="view"
      className={clsx(
        styles.savedAddressViewContainer,
        styles.savedAddressViewContainerFill,
        styles.savedAddressViewContainerEnvelope,
        role === 'sender'
          ? styles.savedAddressViewContainerEnvelopeSender
          : styles.savedAddressViewContainerEnvelopeRecipient,
        role === 'sender' && styles.savedAddressViewContainerEnvelopeNoToolbar,
      )}
    >
      {role !== 'sender' ? (
        <div
          className={styles.savedAddressViewToolbar}
          data-envelope-address-view-toolbar
        >
          <Toolbar section="recipientView" />
        </div>
      ) : null}
      <div
        ref={containerRef}
        className={clsx(
          styles.savedAddressViewCardWrap,
          role === 'sender'
            ? styles.savedAddressViewCardWrapSender
            : styles.savedAddressViewCardWrapRecipient,
        )}
      >
        {isEditMode ? renderEditMode() : renderViewMode()}
      </div>
    </div>
  )
}

export const SenderView: React.FC<SenderViewProps> = (props) => (
  <SingleAddressView {...props} role="sender" />
)

export const RecipientView: React.FC<RecipientViewProps> = (props) => (
  <SingleAddressView {...props} role="recipient" />
)
