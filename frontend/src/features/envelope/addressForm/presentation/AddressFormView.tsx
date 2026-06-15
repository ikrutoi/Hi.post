import React, {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
} from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { Label } from './Label/Label'
import { useEnvelopeAddress } from '../application/hooks'
import { useEnvelopeFacade } from '../../application/facades/useEnvelopeFacade'
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
  /** Mobile envelope: inset section card with toolbar + form. */
  mobileFullscreen?: boolean
}

export const AddressFormView: React.FC<AddressFormViewProps> = ({
  role,
  roleLabel,
  address,
  onFieldChange,
  lang,
  mobileFullscreen = false,
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

  const toolbarSection =
    role === 'sender' ? 'senderCreate' : 'recipientCreate'

  useLayoutEffect(() => {
    syncAddressFormToolbar(toolbarSection, isAddressComplete)
  }, [syncAddressFormToolbar, toolbarSection, isAddressComplete])

  // Only auto-focus first input on mount when nothing in the form is focused (avoid stealing focus on remount)
  useEffect(() => {
    const firstInput = inputsRef.current[0]
    if (!firstInput) return
    const container = firstInput.closest('[data-envelope-address-surface]')
    const active = document.activeElement as Node | null
    if (active && container?.contains(active)) return
    const len = firstInput.value.length
    firstInput.focus()
    try {
      firstInput.setSelectionRange(len, len)
    } catch {
      /* Edge may reject setSelectionRange on some input types/states */
    }
  }, [])

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
                onKeyDown={(e) => handleKeyDown(e, idx)}
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
        onKeyDown={(e) => handleKeyDown(e, idx)}
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
        className={addressViewStyles.savedAddressViewToolbar}
        data-envelope-address-view-toolbar
      >
        <Toolbar section={toolbarSection} />
      </div>
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
          <div className={styles.addressFormFields}>{fields}</div>
        </div>
      </div>
    </div>
  )
}
