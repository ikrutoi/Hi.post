import React, {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
} from 'react'
import clsx from 'clsx'
import { Label } from './Label/Label'
import { useEnvelopeAddress } from '../application/hooks'
import { useEnvelopeFacade } from '../../application/facades/useEnvelopeFacade'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { ENVELOPE_DESKTOP_RECIPIENT_DETAIL_TOOLBAR } from '@toolbar/domain/types/addressView.types'
import type { AddressFields } from '@shared/config/constants'
import type { Lang } from '@i18n/types'
import styles from './AddressFormView.module.scss'
import addressViewStyles from './AddressView.module.scss'

export type AddressFormViewProps = {
  role: 'sender' | 'recipient'
  roleLabel: string
  address: AddressFields
  onFieldChange: (field: keyof AddressFields, value: string) => void
  lang: Lang
  /** Mobile envelope: fullscreen form with senderCreate/recipientCreate toolbar. */
  mobileFullscreen?: boolean
  /** Desktop top slot: read-only detailed address with view toolbar. */
  readOnly?: boolean
}

export const AddressFormView: React.FC<AddressFormViewProps> = ({
  role,
  roleLabel,
  address,
  onFieldChange,
  lang,
  mobileFullscreen = false,
  readOnly = false,
}) => {
  const { syncAddressFormToolbar } = useEnvelopeFacade()
  const { labelLayout } = useEnvelopeAddress(role, lang)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const setInputRef = useCallback((el: HTMLInputElement | null, index: number) => {
    if (el) inputsRef.current[index] = el
  }, [])

  const isAddressComplete = useMemo(
    () => Object.values(address).every((v) => (v ?? '').trim() !== ''),
    [address],
  )

  const createToolbarSection =
    role === 'sender' ? 'senderCreate' : 'recipientCreate'
  const toolbarSection = readOnly ? 'recipientView' : createToolbarSection

  useLayoutEffect(() => {
    if (readOnly) return
    syncAddressFormToolbar(createToolbarSection, isAddressComplete)
  }, [
    syncAddressFormToolbar,
    createToolbarSection,
    isAddressComplete,
    readOnly,
  ])

  // Focus the name field on open. Do not keep whatever the browser focused
  // first (iOS/Chrome often land on Country in an address form).
  useEffect(() => {
    if (readOnly) return
    const nameInput =
      inputsRef.current.find((el) => el?.dataset.addressField === 'name') ??
      inputsRef.current[0]
    if (!nameInput) return
    const focusName = () => {
      if (document.activeElement === nameInput) return
      nameInput.focus()
      try {
        const len = nameInput.value.length
        nameInput.setSelectionRange(len, len)
      } catch {
        /* Edge may reject setSelectionRange on some input types/states */
      }
    }
    focusName()
    const frame = window.requestAnimationFrame(focusName)
    const timer = window.setTimeout(focusName, 50)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [readOnly])

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault()
      inputsRef.current[index + 1]?.focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      inputsRef.current[index - 1]?.focus()
    }
  }

  let fieldIndex = 0
  const fields = labelLayout.map((item, i) => {
    if (Array.isArray(item)) {
      return (
        <div
          key={`group-${i}`}
          className={clsx(styles.labelGroup, styles[`labelGroup${roleLabel}`])}
        >
          {item.map((subItem, j) => {
            const idx = fieldIndex++
            return (
              <Label
                key={`${subItem.key}-${i}-${j}`}
                ref={(el: HTMLInputElement | null) => setInputRef(el, idx)}
                role={role}
                roleLabel={roleLabel}
                label={subItem.label}
                field={subItem.key}
                value={address[subItem.key]}
                onValueChange={onFieldChange}
                onKeyDown={readOnly ? undefined : (e) => handleKeyDown(e, idx)}
                autoFocus={!readOnly && mobileFullscreen && subItem.key === 'name'}
                readOnly={readOnly}
              />
            )
          })}
        </div>
      )
    }
    const idx = fieldIndex++
    return (
      <Label
        key={`${item.key}-${i}`}
        ref={(el: HTMLInputElement | null) => setInputRef(el, idx)}
        role={role}
        roleLabel={roleLabel}
        label={item.label}
        field={item.key}
        value={address[item.key]}
        onValueChange={onFieldChange}
        onKeyDown={readOnly ? undefined : (e) => handleKeyDown(e, idx)}
        autoFocus={!readOnly && mobileFullscreen && item.key === 'name'}
        readOnly={readOnly}
      />
    )
  })

  return (
    <div
      className={clsx(
        addressViewStyles.savedAddressViewContainer,
        mobileFullscreen
          ? addressViewStyles.savedAddressViewContainerMobileFullscreen
          : addressViewStyles.savedAddressViewContainerFixed,
        !mobileFullscreen && addressViewStyles.savedAddressViewContainerCreate,
      )}
      data-envelope-address-surface
    >
      <div
        className={clsx(
          addressViewStyles.savedAddressViewCardWrap,
          role === 'sender'
            ? addressViewStyles.savedAddressViewCardWrapSender
            : addressViewStyles.savedAddressViewCardWrapRecipient,
        )}
      >
        <div
          className={clsx(
            addressViewStyles.savedAddressView,
            role === 'sender'
              ? addressViewStyles.savedAddressViewSender
              : addressViewStyles.savedAddressViewRecipient,
            styles.addressFormView,
            mobileFullscreen && styles.addressFormViewMobileFullscreen,
            addressViewStyles.savedAddressViewCreateForm,
          )}
        >
          <div className={styles.addressFormTopBar}>
            {!mobileFullscreen ? (
              <Toolbar
                section={toolbarSection}
                groupsOverride={
                  readOnly ? ENVELOPE_DESKTOP_RECIPIENT_DETAIL_TOOLBAR : undefined
                }
              />
            ) : null}
          </div>
          <div className={styles.addressFormFields}>{fields}</div>
        </div>
      </div>
    </div>
  )
}
