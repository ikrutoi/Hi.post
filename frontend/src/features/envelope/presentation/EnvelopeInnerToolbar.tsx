import React, { useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { useAppSelector } from '@app/hooks'
import {
  selectActiveRecipientsToolbarState,
  selectActiveSenderToolbarState,
  selectRecipientViewEditMode,
  selectSenderViewEditMode,
} from '@envelope/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxSender,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { ENVELOPE_MOBILE_ADDRESS_VIEW_UPPER_RETURN_TOOLBAR } from '@toolbar/domain/types/addressView.types'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
import styles from './Envelope.module.scss'

type AddressAddToolbarMeta = {
  state: string
  badge: number | null
  badgeDot: boolean
}

/** После Apply sender/recipient: одна иконка postcardEdit (IconCardPieEdit). */
const ADDRESS_APPLY_PEEK_TOOLBAR: ToolbarConfig = [
  {
    group: 'edit',
    icons: [{ key: 'postcardEdit', state: 'enabled' }],
    status: 'enabled',
  },
]

function readAddressAddMeta(
  toolbarState: Record<string, unknown>,
): AddressAddToolbarMeta {
  const raw = toolbarState.addressAdd
  if (raw == null) return { state: 'disabled', badge: null, badgeDot: false }
  if (typeof raw === 'string') return { state: raw, badge: null, badgeDot: false }
  if (typeof raw !== 'object' || raw == null || !('state' in raw)) {
    return { state: 'disabled', badge: null, badgeDot: false }
  }
  const options =
    'options' in raw && raw.options != null && typeof raw.options === 'object'
      ? (raw.options as { badge?: number | null; badgeDot?: boolean })
      : null
  return {
    state: String(raw.state ?? 'disabled'),
    badge: options?.badge ?? null,
    badgeDot: Boolean(options?.badgeDot),
  }
}

export const EnvelopeInnerToolbar: React.FC = () => {
  const isMobile = useAppSelector(selectIsMobileLayout)
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxSender = useAppSelector(selectArchiveSandboxSender)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const sessionSenderView = useAppSelector(selectSenderView)
  const sessionRecipientView = useAppSelector(selectRecipientView)
  const senderView = sandboxActive
    ? sandboxSender.currentView
    : sessionSenderView
  const recipientView = sandboxActive
    ? sandboxRecipient.currentView
    : sessionRecipientView
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const focusRole = mobileFocus?.focusRole ?? null
  const dualSide = mobileFocus?.dualSide ?? 'sender'
  const setDualSide = mobileFocus?.setDualSide
  /** Session or archive sandbox — same builders / badges. */
  const senderToolbarState = useAppSelector(selectActiveSenderToolbarState)
  const recipientsToolbarState = useAppSelector(
    selectActiveRecipientsToolbarState,
  )
  const pendingAddressAddFocusRef = useRef<'sender' | 'recipient' | null>(null)

  /** Dual: inactive side uses simplified peek chrome (postcardEdit). */
  const senderSideSimplified = isMobile && dualSide === 'recipient'
  const recipientSideSimplified = isMobile && dualSide === 'sender'

  /** После apply выходим из focus — postcardEdit в слоте sender/recipients. */
  useEffect(() => {
    if (mobileFocus == null) return
    if (senderSideSimplified && mobileFocus.focusRole === 'sender') {
      mobileFocus.clearFocus()
      return
    }
    if (recipientSideSimplified && mobileFocus.focusRole === 'recipient') {
      mobileFocus.clearFocus()
    }
  }, [senderSideSimplified, recipientSideSimplified, mobileFocus])

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
        section === 'sender' ? senderToolbarState : recipientsToolbarState,
      )

      if (addState === 'active') {
        mobileFocus.toggleFocus(role)
        return false
      }

      if (addState === 'enabled') {
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
      senderToolbarState,
      recipientsToolbarState,
    ],
  )

  const handleSenderApplyPeekClick = useCallback(
    (key: IconKey): void | false => {
      if (key !== 'postcardEdit') return
      setDualSide?.('sender')
      return false
    },
    [setDualSide],
  )

  const handleRecipientApplyPeekClick = useCallback(
    (key: IconKey): void | false => {
      if (key !== 'postcardEdit') return
      setDualSide?.('recipient')
      return false
    },
    [setDualSide],
  )

  const showSenderSlot = focusRole !== 'recipient'
  const showRecipientsSlot = focusRole !== 'sender'
  const showFocusReturn =
    isMobile && focusRole != null && mobileFocus != null
  /** Mobile factory: dual toggle — active side View, other simplified. */
  const showCenterDualToggle =
    isMobile &&
    !showFocusReturn &&
    showSenderSlot &&
    showRecipientsSlot &&
    setDualSide != null

  const handleCenterDualToggle = useCallback(
    (checked: boolean) => {
      setDualSide?.(checked ? 'recipient' : 'sender')
    },
    [setDualSide],
  )

  const handleFocusReturn = useCallback(
    (key: IconKey): void | false => {
      if (key !== 'return' || mobileFocus == null || focusRole == null) return

      const isEditMode =
        focusRole === 'sender' ? senderViewEditMode : recipientViewEditMode
      if (isEditMode) return false

      mobileFocus.clearFocus()
      return false
    },
    [
      mobileFocus,
      focusRole,
      senderViewEditMode,
      recipientViewEditMode,
    ],
  )

  const senderToolbar = senderSideSimplified ? (
    <Toolbar
      section="sender"
      groupsOverride={ADDRESS_APPLY_PEEK_TOOLBAR}
      onActionClick={handleSenderApplyPeekClick}
    />
  ) : (
    <Toolbar
      section="sender"
      stateOverride={senderToolbarState}
      onActionClick={(key) => handleAddressAddClick('sender', key)}
    />
  )

  const recipientsToolbar = recipientSideSimplified ? (
    <Toolbar
      section="recipients"
      groupsOverride={ADDRESS_APPLY_PEEK_TOOLBAR}
      onActionClick={handleRecipientApplyPeekClick}
    />
  ) : (
    <Toolbar
      section="recipients"
      stateOverride={recipientsToolbarState}
      onActionClick={(key) => handleAddressAddClick('recipients', key)}
    />
  )

  return (
    <div
      className={clsx(
        styles.envelopeToolbarRow,
        showFocusReturn && styles.envelopeToolbarRowAddressFocus,
      )}
    >
      {showFocusReturn ? (
        <>
          <div className={styles.envelopeToolbarFocusLeft}>
            {focusRole === 'sender' ? senderToolbar : recipientsToolbar}
          </div>
          <div className={styles.envelopeToolbarFocusReturn}>
            <Toolbar
              section={
                focusRole === 'sender' ? 'senderView' : 'recipientView'
              }
              groupsOverride={ENVELOPE_MOBILE_ADDRESS_VIEW_UPPER_RETURN_TOOLBAR}
              className={toolbarStyles.toolbarAromaUpperReturn}
              onActionClick={handleFocusReturn}
            />
          </div>
        </>
      ) : (
        <>
          {showSenderSlot ? (
            <div
              className={clsx(
                styles.envelopeToolbarSlotSender,
                senderView === 'senderCreate' &&
                  styles.envelopeToolbarSlotDisabled,
              )}
            >
              {senderToolbar}
            </div>
          ) : null}
          {showCenterDualToggle ? (
            <div className={styles.envelopeToolbarCenterToggle}>
              <Toggle
                label=""
                checked={dualSide === 'recipient'}
                onChange={handleCenterDualToggle}
                size="default"
                variant="envelopeDual"
                ariaLabel="Envelope side"
              />
            </div>
          ) : null}
          {showRecipientsSlot ? (
            <div
              className={clsx(
                styles.envelopeToolbarSlotRecipients,
                recipientView === 'recipientCreate' &&
                  styles.envelopeToolbarSlotDisabled,
              )}
            >
              {recipientsToolbar}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
