import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import {
  selectRecipientsToolbarStateWithLiveAddressList,
  selectSenderToolbarStateWithLiveAddressList,
  selectRecipientViewEditMode,
  selectSenderViewEditMode,
} from '@envelope/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import type { IconKey } from '@shared/config/constants'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
import styles from './Envelope.module.scss'

type AddressAddToolbarMeta = {
  state: string
  badge: number | null
}

function readAddressAddMeta(
  toolbarState: Record<string, unknown>,
): AddressAddToolbarMeta {
  const raw = toolbarState.addressAdd
  if (raw == null) return { state: 'disabled', badge: null }
  if (typeof raw === 'string') return { state: raw, badge: null }
  if (typeof raw !== 'object' || raw == null || !('state' in raw)) {
    return { state: 'disabled', badge: null }
  }
  const options =
    'options' in raw && raw.options != null && typeof raw.options === 'object'
      ? (raw.options as { badge?: number | null })
      : null
  return {
    state: String(raw.state ?? 'disabled'),
    badge: options?.badge ?? null,
  }
}

function withAddressAddDisabledOnAddressViewFocus(
  toolbarState: Record<string, unknown>,
  params: {
    isMobile: boolean
    role: 'sender' | 'recipient'
    isFocused: boolean
    view: string
    pendingDisableRole: 'sender' | 'recipient' | null
  },
): Record<string, unknown> {
  const { isMobile, role, isFocused, view, pendingDisableRole } = params
  const targetView = role === 'sender' ? 'senderView' : 'recipientView'
  const forceDisable =
    isMobile &&
    (pendingDisableRole === role || (isFocused && view === targetView))
  if (!forceDisable) return toolbarState

  const { state, badge } = readAddressAddMeta(toolbarState)
  if (state !== 'active' && state !== 'enabled') return toolbarState

  return {
    ...toolbarState,
    addressAdd: {
      state: 'disabled',
      options: { badge },
    },
  }
}

export const EnvelopeInnerToolbar: React.FC = () => {
  const isMobile = useAppSelector(selectIsMobileLayout)
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const focusRole = mobileFocus?.focusRole ?? null
  const senderToolbarStateWithLiveAddressList = useAppSelector(
    selectSenderToolbarStateWithLiveAddressList,
  )
  const recipientsToolbarStateWithLiveAddressList = useAppSelector(
    selectRecipientsToolbarStateWithLiveAddressList,
  )
  const pendingAddressAddFocusRef = useRef<'sender' | 'recipient' | null>(null)
  const [addressAddPendingDisableRole, setAddressAddPendingDisableRole] =
    useState<'sender' | 'recipient' | null>(null)

  useEffect(() => {
    if (focusRole == null) {
      setAddressAddPendingDisableRole(null)
    }
  }, [focusRole])

  useEffect(() => {
    if (!isMobile || mobileFocus == null) return

    const pending = pendingAddressAddFocusRef.current
    if (pending == null) return

    const targetView = pending === 'sender' ? 'senderView' : 'recipientView'
    const view = pending === 'sender' ? senderView : recipientView

    if (view === targetView) {
      if (!mobileFocus.isFocused(pending)) {
        mobileFocus.toggleFocus(pending)
      }
      pendingAddressAddFocusRef.current = null
      return
    }

    if (view === 'senderCreate' || view === 'recipientCreate') {
      pendingAddressAddFocusRef.current = null
      setAddressAddPendingDisableRole(null)
    }
  }, [isMobile, mobileFocus, senderView, recipientView])

  const handleAddressAddClick = useCallback(
    (section: 'sender' | 'recipients', key: IconKey): void | false => {
      if (key !== 'addressAdd' || !isMobile || mobileFocus == null) return

      const role = section === 'sender' ? 'sender' : 'recipient'
      const view = role === 'sender' ? senderView : recipientView
      if (view === 'senderCreate' || view === 'recipientCreate') return

      const isEditMode =
        role === 'sender' ? senderViewEditMode : recipientViewEditMode
      if (isEditMode) return false

      const { state: addState } = readAddressAddMeta(
        section === 'sender'
          ? senderToolbarStateWithLiveAddressList
          : recipientsToolbarStateWithLiveAddressList,
      )

      if (addState === 'active') {
        const wasFocused = mobileFocus.isFocused(role)
        if (wasFocused) {
          setAddressAddPendingDisableRole(null)
        } else {
          setAddressAddPendingDisableRole(role)
        }
        mobileFocus.toggleFocus(role)
        return false
      }

      if (addState === 'enabled') {
        setAddressAddPendingDisableRole(role)
        pendingAddressAddFocusRef.current = role
        const targetView = role === 'sender' ? 'senderView' : 'recipientView'
        if (view === targetView && !mobileFocus.isFocused(role)) {
          mobileFocus.toggleFocus(role)
        }
      }
    },
    [
      isMobile,
      mobileFocus,
      senderView,
      recipientView,
      senderViewEditMode,
      recipientViewEditMode,
      senderToolbarStateWithLiveAddressList,
      recipientsToolbarStateWithLiveAddressList,
    ],
  )

  const showSenderSlot = focusRole !== 'recipient'
  const showRecipientsSlot = focusRole !== 'sender'

  const senderToolbarState = useMemo(
    () =>
      withAddressAddDisabledOnAddressViewFocus(
        senderToolbarStateWithLiveAddressList,
        {
          isMobile,
          role: 'sender',
          isFocused: mobileFocus?.isFocused('sender') ?? false,
          view: senderView,
          pendingDisableRole: addressAddPendingDisableRole,
        },
      ),
    [
      senderToolbarStateWithLiveAddressList,
      isMobile,
      mobileFocus,
      senderView,
      addressAddPendingDisableRole,
    ],
  )

  const recipientsToolbarState = useMemo(
    () =>
      withAddressAddDisabledOnAddressViewFocus(
        recipientsToolbarStateWithLiveAddressList,
        {
          isMobile,
          role: 'recipient',
          isFocused: mobileFocus?.isFocused('recipient') ?? false,
          view: recipientView,
          pendingDisableRole: addressAddPendingDisableRole,
        },
      ),
    [
      recipientsToolbarStateWithLiveAddressList,
      isMobile,
      mobileFocus,
      recipientView,
      addressAddPendingDisableRole,
    ],
  )

  return (
    <div className={styles.envelopeToolbarRow}>
      {showSenderSlot ? (
        <div
          className={clsx(
            styles.envelopeToolbarSlotSender,
            focusRole === 'sender' && styles.envelopeToolbarSlotFocusedOnly,
            senderView === 'senderCreate' && styles.envelopeToolbarSlotDisabled,
          )}
        >
          <Toolbar
            section="sender"
            stateOverride={senderToolbarState}
            onActionClick={(key) => handleAddressAddClick('sender', key)}
          />
        </div>
      ) : null}
      {showRecipientsSlot ? (
        <div
          className={clsx(
            styles.envelopeToolbarSlotRecipients,
            focusRole === 'recipient' && styles.envelopeToolbarSlotFocusedOnly,
            recipientView === 'recipientCreate' &&
              styles.envelopeToolbarSlotDisabled,
          )}
        >
          <Toolbar
            section="recipients"
            stateOverride={recipientsToolbarState}
            onActionClick={(key) => handleAddressAddClick('recipients', key)}
          />
        </div>
      ) : null}
    </div>
  )
}
