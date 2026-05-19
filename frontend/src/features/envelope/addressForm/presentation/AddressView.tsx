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
  closeAddressEditSession,
  removeRecipientAt,
  setAddressFormView,
  setRecipientsPendingIds,
  updateAddressEditDraftField,
} from '@envelope/infrastructure/state'
import { selectRecipientsPendingIds } from '@envelope/infrastructure/selectors'
import {
  clearRecipientViewDraft,
  removeRecipientFromListById,
  removeRecipientFromListByIndex,
  setRecipientApplied,
  setRecipientAppliedIds,
  setRecipientView,
  setRecipientViewId,
  setRecipientsViewIds,
  setRecipientsViewIdsSecondList,
  updateRecipientField,
} from '@envelope/recipient/infrastructure/state'
import {
  selectRecipientApplied,
  selectRecipientState,
  selectRecipientsDisplayList,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectSenderApplied,
  selectAppliedSenderDisplayAddress,
} from '@envelope/sender/infrastructure/selectors'
import {
  clearSender,
  clearSenderViewDraft,
  setSenderApplied,
  setSenderView,
  setSenderViewId,
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
  const recipientState = useAppSelector(selectRecipientState)
  const recipientAppliedIds = useAppSelector(selectRecipientApplied)
  const recipientsPendingIds = useAppSelector(selectRecipientsPendingIds)
  const recipientsDisplayList = useAppSelector(selectRecipientsDisplayList)
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const senderAppliedIds = useAppSelector(selectSenderApplied)
  const appliedSenderAddress = useAppSelector(selectAppliedSenderDisplayAddress)
  const isEditMode =
    role === 'sender' ? senderViewEditMode : recipientViewEditMode

  /** Несколько получателей: applied.length > 1 (appliedData = null) или список «Пользователи». */
  const showReturnInsteadOfClose =
    role === 'recipient' &&
    (recipientAppliedIds.length > 1 || recipientsDisplayList.length > 1)

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
            'button[data-icon-key="addList"], button[data-icon-key="removeFromList"]',
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
          '[data-address-book-entry], [data-address-book-list], [data-envelope-address-actions], [data-envelope-address-fieldset]',
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
          'button[data-icon-key="addList"], button[data-icon-key="removeFromList"]',
        )
      ) {
        dispatch(toolbarAction({ section: toolbarSection, key: 'edit' } as any))
      }
      return
    }
    if (next.closest('[data-envelope-address-actions]')) return
    if (next.closest('[data-envelope-address-edit-close]')) return
    // Ignore blur shortly after opening edit (e.g. from list panel) so focus has time to land
    if (Date.now() - editModeOpenedAt.current < 200) return

    const section =
      role === 'sender' ? 'senderView' : 'recipientView'
    dispatch(toolbarAction({ section, key: 'edit' } as any))
  }

  const toolbarSection =
    role === 'sender' ? 'senderView' : 'recipientView'

  const removeSenderFromForm = () => {
    dispatch(closeAddressEditSession({ role: 'sender' }))
    const appliedId = senderAppliedIds[0] ?? null

    if (appliedId) {
      if (templateId !== appliedId) {
        dispatch(setSenderViewId(appliedId))
        ;(
          Object.entries(appliedSenderAddress) as [
            keyof AddressFields,
            string,
          ][]
        ).forEach(([field, value]) =>
          dispatch(updateSenderField({ field, value })),
        )
        dispatch(setSenderView('senderView'))
        dispatch(setAddressFormView({ show: false, role: null }))
        return
      }

      // Закрытие карточки applied: только UI; applied / appliedData не трогаем.
      dispatch(setSenderViewId(null))
      dispatch(clearSenderViewDraft())
      dispatch(setSenderView('senderEnvelopeView'))
      dispatch(setAddressFormView({ show: false, role: null }))
      return
    }

    dispatch(setSenderViewId(null))
    dispatch(setSenderApplied(false))
    dispatch(clearSender())
    dispatch(setAddressFormView({ show: false, role: null }))
  }

  const removeRecipientFromForm = () => {
    if (!templateId) return

    dispatch(closeAddressEditSession({ role: 'recipient' }))

    const nextApplied = (recipientState.applied ?? []).filter(
      (id) => id !== templateId,
    )
    if (nextApplied.length === 0) {
      dispatch(setRecipientApplied(false))
    } else {
      dispatch(setRecipientAppliedIds(nextApplied))
    }

    // Сразу закрываем карточку и показываем плейсхолдер (сага догонит списки).
    dispatch(setRecipientViewId(null))
    dispatch(clearRecipientViewDraft())
    dispatch(setRecipientView('recipientsView'))
    dispatch(setAddressFormView({ show: false, role: null }))

    const firstList = recipientState.recipientsViewIdsFirstList ?? []
    dispatch(
      setRecipientsViewIds(firstList.filter((id) => id !== templateId)),
    )
    if (recipientState.currentRecipientsList === 'second') {
      const secondList = recipientState.recipientsViewIdsSecondList ?? []
      dispatch(
        setRecipientsViewIdsSecondList(
          secondList.filter((id) => id !== templateId),
        ),
      )
    }
    dispatch(
      setRecipientsPendingIds(
        recipientsPendingIds.filter((id) => id !== templateId),
      ),
    )

    if (templateId.startsWith('recipient-')) {
      const index = parseInt(templateId.replace('recipient-', ''), 10)
      if (!Number.isNaN(index)) {
        dispatch(removeRecipientFromListByIndex(index))
        dispatch(removeRecipientAt(index))
      }
    } else {
      dispatch(removeRecipientFromListById(templateId))
    }
  }

  const backToRecipientsList = () => {
    if (recipientViewEditMode) {
      dispatch(
        closeAddressEditSession({ role: 'recipient', keepRecipientView: true }),
      )
    }
    dispatch(setRecipientView('recipientsView'))
    dispatch(setRecipientViewId(null))
  }

  const handleDismissSavedCard = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (role === 'sender') {
      removeSenderFromForm()
    } else if (showReturnInsteadOfClose) {
      backToRecipientsList()
    } else {
      removeRecipientFromForm()
    }
  }

  const savedAddressDismissButton = (
    <button
      type="button"
      className={clsx(
        styles.savedAddressActionButton,
        styles.savedAddressCloseButton,
      )}
      aria-label={
        showReturnInsteadOfClose ? 'Back to recipients list' : 'Close'
      }
      title={showReturnInsteadOfClose ? 'Back to list' : 'Close'}
      onClick={handleDismissSavedCard}
    >
      {getToolbarIcon({
        key: showReturnInsteadOfClose ? 'return' : 'clearInput',
      })}
    </button>
  )

  const handleFormEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(toolbarAction({ section: toolbarSection, key: 'edit' } as any))
  }

  const handleCloseEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch(toolbarAction({ section: toolbarSection, key: 'edit' } as any))
  }

  const editCloseButton = (
    <button
      type="button"
      className={clsx(
        styles.savedAddressActionButton,
        styles.savedAddressCloseButton,
      )}
      data-envelope-address-edit-close
      aria-label="Close edit"
      title="Close"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={handleCloseEdit}
    >
      {getToolbarIcon({ key: 'close' })}
    </button>
  )

  const handleFormDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(toolbarAction({ section: toolbarSection, key: 'delete' } as any))
  }

  const savedAddressFormActions = (
    <div
      className={styles.savedAddressFormActions}
      data-envelope-address-actions
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={clsx(
          styles.savedAddressActionButton,
          isEditMode && styles.savedAddressActionButtonActive,
        )}
        aria-label="Edit address"
        title="Edit address"
        aria-pressed={isEditMode}
        onClick={handleFormEdit}
      >
        {getToolbarIcon({ key: 'edit' })}
      </button>
      {!isEditMode && (
        <button
          type="button"
          className={clsx(
            styles.savedAddressActionButton,
            styles.savedAddressActionButtonDelete,
          )}
          aria-label="Delete address"
          title="Delete address"
          onClick={handleFormDelete}
        >
          {getToolbarIcon({ key: 'delete' })}
        </button>
      )}
    </div>
  )

  const savedAddressViewClassName = clsx(
    styles.savedAddressView,
    styles.savedAddressViewWithFormActions,
    role === 'sender'
      ? styles.savedAddressViewSender
      : styles.savedAddressViewRecipient,
  )

  const renderViewMode = () => (
    <div className={savedAddressViewClassName}>
      {savedAddressDismissButton}
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
      {savedAddressFormActions}
    </div>
  )

  const renderEditMode = () => (
    <div
      className={savedAddressViewClassName}
      onMouseDown={(e) => {
        if (!isEditMode) return
        const target = e.target as HTMLElement
        if (target.closest('[data-address-edit-row]')) return
        if (target.closest('[data-envelope-address-edit-close]')) return
        if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON') {
          e.preventDefault()
        }
      }}
    >
      {editCloseButton}
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
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
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
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
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
      {savedAddressFormActions}
    </div>
  )

  return (
    <div
      data-envelope-address-surface
      className={clsx(
        styles.savedAddressViewContainer,
        styles.savedAddressViewContainerFixed,
      )}
    >
      <div
        className={styles.savedAddressViewToolbar}
        data-envelope-address-view-toolbar
      >
        <Toolbar
          section={
            role === 'sender' ? 'senderView' : 'recipientView'
          }
        />
      </div>
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
