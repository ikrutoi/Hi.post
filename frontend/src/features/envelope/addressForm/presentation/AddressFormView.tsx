import React, { useRef, useCallback, useMemo, useEffect } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { Label } from './Label/Label'
import { useEnvelopeAddress } from '../application/hooks'
import { useEnvelopeFacade } from '../../application/facades/useEnvelopeFacade'
import type { AddressFields } from '@shared/config/constants'
import type { Lang } from '@i18n/types'
import styles from './AddressFormView.module.scss'
import { IconX } from '@/shared/ui/icons'

export type AddressFormViewProps = {
  role: 'sender' | 'recipient'
  roleLabel: string
  address: AddressFields
  onFieldChange: (field: keyof AddressFields, value: string) => void
  lang: Lang
}

export const AddressFormView: React.FC<AddressFormViewProps> = ({
  role,
  roleLabel,
  address,
  onFieldChange,
  lang,
}) => {
  const {
    closeAddressForm,
    syncAddressFormToolbar,
    showAddressFormCloseButton,
  } = useEnvelopeFacade()
  const { labelLayout } = useEnvelopeAddress(role, lang)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const showCloseBtn = showAddressFormCloseButton(role)

  const isAddressComplete = useMemo(
    () => Object.values(address).every((v) => (v ?? '').trim() !== ''),
    [address],
  )

  const toolbarSection =
    role === 'sender' ? 'addressFormSenderView' : 'addressFormRecipientView'

  useEffect(() => {
    syncAddressFormToolbar(toolbarSection, isAddressComplete)
  }, [syncAddressFormToolbar, toolbarSection, isAddressComplete])

  useEffect(() => {
    const firstInput = inputsRef.current[0]
    if (firstInput) {
      const len = firstInput.value.length
      firstInput.focus()
      firstInput.setSelectionRange(len, len)
    }
  }, [])

  const handleCloseAddressForm = useCallback(() => {
    closeAddressForm(role)
  }, [closeAddressForm, role])

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleCloseAddressForm()
    },
    [handleCloseAddressForm],
  )

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
                ref={(el: HTMLInputElement | null) => {
                  if (el) inputsRef.current[idx] = el
                }}
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
        ref={(el: HTMLInputElement | null) => {
          if (el) inputsRef.current[idx] = el
        }}
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
    <div className={styles.addressFormViewContainer}>
      <div
        className={clsx(
          styles.addressFormViewToolbar,
          styles[`addressFormViewToolbar${roleLabel}`],
        )}
      >
        <Toolbar section={toolbarSection} />
      </div>
      <div
        className={clsx(
          styles.addressFormView,
          role === 'sender' && styles.addressFormSenderView,
          role === 'recipient' && styles.addressFormRecipientView,
        )}
      >
        {fields}
      </div>
      {showCloseBtn && (
        <button
          type="button"
          className={clsx(styles.closeBtn, styles[`closeBtn${roleLabel}`])}
          onClick={handleCloseClick}
          aria-label="Close address form"
        >
          <IconX />
        </button>
      )}
    </div>
  )
}
