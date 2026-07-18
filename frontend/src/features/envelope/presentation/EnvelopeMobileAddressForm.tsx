import React, { useCallback } from 'react'
import clsx from 'clsx'
import { AddressFormView } from '../addressForm/presentation/AddressFormView'
import { useSenderFacade } from '../sender/application/facades'
import { useRecipientFacade } from '../recipient/application/facades'
import type { Lang } from '@i18n/types'
import styles from './Envelope.module.scss'

type Props = {
  role: 'sender' | 'recipient'
  lang: Lang
}

const FOCUSABLE_SELECTOR =
  'input, textarea, select, button, a, [role="button"], label'

function isFocusableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(target.closest(FOCUSABLE_SELECTOR))
}

/**
 * Keep the focused field (and OS keyboard) when tapping empty space around the form.
 * preventDefault stops the browser from blurring the active input.
 */
function keepKeyboardOnEmptyPointerDown(e: React.PointerEvent) {
  if (isFocusableTarget(e.target)) return
  e.preventDefault()
}

function keepKeyboardOnEmptyTouchStart(e: React.TouchEvent) {
  if (isFocusableTarget(e.target)) return
  e.preventDefault()
}

export const EnvelopeMobileAddressForm: React.FC<Props> = ({ role, lang }) => {
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()
  const roleLabel = role === 'sender' ? 'Sender' : 'Recipients'
  const facade = role === 'sender' ? senderFacade : recipientFacade

  const onPointerDown = useCallback(keepKeyboardOnEmptyPointerDown, [])
  const onTouchStart = useCallback(keepKeyboardOnEmptyTouchStart, [])

  return (
    <div
      className={styles.envelopeMobileCreateSurface}
      onPointerDown={onPointerDown}
      onTouchStart={onTouchStart}
    >
      <div
        className={clsx(
          styles.envelopeMobileCreateCard,
          role === 'sender'
            ? styles.envelopeMobileCreateCardSender
            : styles.envelopeMobileCreateCardRecipient,
        )}
      >
        <AddressFormView
          role={role}
          roleLabel={roleLabel}
          address={facade.formDraft}
          onFieldChange={facade.update}
          lang={lang}
          mobileFullscreen
        />
      </div>
    </div>
  )
}
