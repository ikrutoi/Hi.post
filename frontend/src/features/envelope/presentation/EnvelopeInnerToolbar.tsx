import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectRecipientsToolbarStateWithLiveAddressList,
  selectSenderToolbarStateWithLiveAddressList,
  selectRecipientViewEditMode,
  selectSenderViewEditMode,
} from '@envelope/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { setRecipientApplied } from '@envelope/recipient/infrastructure/state'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { setSenderApplied } from '@envelope/sender/infrastructure/state'
import {
  setArchiveSenderApplied,
  setArchiveRecipientApplied,
} from '@cardPanel/infrastructure/state'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxSender,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
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

function buildArchiveSandboxSenderEditToolbar(
  applyState: 'enabled' | 'disabled',
): ToolbarConfig {
  return [
    {
      group: 'address',
      icons: [
        { key: 'apply', state: applyState },
        { key: 'addressAdd', state: 'enabled' },
        { key: 'addressList', state: 'enabled' },
      ],
      status: 'enabled',
    },
  ]
}

function buildArchiveSandboxRecipientsEditToolbar(
  applyState: 'enabled' | 'disabled',
): ToolbarConfig {
  return [
    {
      group: 'recipients',
      icons: [
        { key: 'apply', state: applyState },
        { key: 'addressAdd', state: 'enabled' },
        { key: 'addressList', state: 'enabled' },
      ],
      status: 'enabled',
    },
  ]
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
      ? (raw.options as { badge?: number | null; badgeDot?: boolean })
      : null
  return {
    state: String(raw.state ?? 'disabled'),
    badge: options?.badge ?? null,
    badgeDot: Boolean(options?.badgeDot),
  }
}

export const EnvelopeInnerToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const isMobile = useAppSelector(selectIsMobileLayout)
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxSender = useAppSelector(selectArchiveSandboxSender)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const focusRole = mobileFocus?.focusRole ?? null
  const senderToolbarState = useAppSelector(
    selectSenderToolbarStateWithLiveAddressList,
  )
  const recipientsToolbarState = useAppSelector(
    selectRecipientsToolbarStateWithLiveAddressList,
  )
  const {
    assemblySenderSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
  } = useMobileFactoryListChrome()
  const pendingAddressAddFocusRef = useRef<'sender' | 'recipient' | null>(null)

  /**
   * Same as left buildSenderToolbarState: enabled + incomplete/empty → Apply disabled;
   * toggle off → Apply enabled (lock empty/disabled sender).
   */
  const archiveSandboxSenderEditToolbar = useMemo((): ToolbarConfig => {
    const applyState: 'enabled' | 'disabled' = !sandboxSender.enabled
      ? 'enabled'
      : sandboxSender.formIsComplete
        ? 'enabled'
        : 'disabled'
    return buildArchiveSandboxSenderEditToolbar(applyState)
  }, [sandboxSender.enabled, sandboxSender.formIsComplete])

  const archiveSandboxRecipientsEditToolbar = useMemo((): ToolbarConfig => {
    const applyState: 'enabled' | 'disabled' = sandboxRecipient.formIsComplete
      ? 'enabled'
      : 'disabled'
    return buildArchiveSandboxRecipientsEditToolbar(applyState)
  }, [sandboxRecipient.formIsComplete])

  /** После apply выходим из focus — postcardEdit в слоте sender/recipients. */
  useEffect(() => {
    if (mobileFocus == null) return
    if (
      assemblySenderSimplifiedPeek &&
      mobileFocus.focusRole === 'sender'
    ) {
      mobileFocus.clearFocus()
      return
    }
    if (
      assemblyRecipientSimplifiedPeek &&
      mobileFocus.focusRole === 'recipient'
    ) {
      mobileFocus.clearFocus()
    }
  }, [
    assemblySenderSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
    mobileFocus,
  ])

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
      if (sandboxActive) {
        dispatch(setArchiveSenderApplied(false))
      } else {
        dispatch(setSenderApplied(false))
      }
      return false
    },
    [dispatch, sandboxActive],
  )

  const handleRecipientApplyPeekClick = useCallback(
    (key: IconKey): void | false => {
      if (key !== 'postcardEdit') return
      if (sandboxActive) {
        dispatch(setArchiveRecipientApplied(false))
      } else {
        dispatch(setRecipientApplied(false))
      }
      return false
    },
    [dispatch, sandboxActive],
  )

  const showSenderSlot = focusRole !== 'recipient'
  const showRecipientsSlot = focusRole !== 'sender'
  const showFocusReturn =
    isMobile && focusRole != null && mobileFocus != null

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

  const senderToolbar = assemblySenderSimplifiedPeek ? (
    <Toolbar
      section="sender"
      groupsOverride={ADDRESS_APPLY_PEEK_TOOLBAR}
      onActionClick={handleSenderApplyPeekClick}
    />
  ) : sandboxActive ? (
    <Toolbar
      section="sender"
      groupsOverride={archiveSandboxSenderEditToolbar}
      onActionClick={(key) => handleAddressAddClick('sender', key)}
    />
  ) : (
    <Toolbar
      section="sender"
      stateOverride={senderToolbarState}
      onActionClick={(key) => handleAddressAddClick('sender', key)}
    />
  )

  const recipientsToolbar = assemblyRecipientSimplifiedPeek ? (
    <Toolbar
      section="recipients"
      groupsOverride={ADDRESS_APPLY_PEEK_TOOLBAR}
      onActionClick={handleRecipientApplyPeekClick}
    />
  ) : sandboxActive ? (
    <Toolbar
      section="recipients"
      groupsOverride={archiveSandboxRecipientsEditToolbar}
      onActionClick={(key) => handleAddressAddClick('recipients', key)}
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
