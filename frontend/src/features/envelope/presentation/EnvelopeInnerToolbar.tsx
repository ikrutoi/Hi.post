import React, { useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectActiveRecipientsToolbarState,
  selectRecipientViewEditMode,
} from '@envelope/infrastructure/selectors'
import { selectRecipientView, selectRecipientsFormViewIdsCount } from '@envelope/recipient/infrastructure/selectors'
import { setRecipientApplied } from '@envelope/recipient/infrastructure/state'
import { setArchiveRecipientApplied } from '@cardPanel/infrastructure/state'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { ENVELOPE_MOBILE_ADDRESS_VIEW_UPPER_RETURN_TOOLBAR } from '@toolbar/domain/types/addressView.types'
import { RECIPIENTS_TOOLBAR_WITH_LIST_CLOSE } from '@toolbar/domain/types/envelope.types'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
import { readAddressAddToolbarMeta } from './readAddressAddToolbarMeta'
import styles from './Envelope.module.scss'

/** После Apply sender/recipient: одна иконка postcardEdit (IconCardPieEdit). */
const ADDRESS_APPLY_PEEK_TOOLBAR: ToolbarConfig = [
  {
    group: 'edit',
    icons: [{ key: 'postcardEdit', state: 'enabled' }],
    status: 'enabled',
  },
]

export const EnvelopeInnerToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const isMobile = useAppSelector(selectIsMobileLayout)
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const sessionRecipientView = useAppSelector(selectRecipientView)
  const recipientView = sandboxActive
    ? sandboxRecipient.currentView
    : sessionRecipientView
  const recipientsFormViewIdsCount = useAppSelector(
    selectRecipientsFormViewIdsCount,
  )
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const focusRole = mobileFocus?.focusRole ?? null
  const dualSide = mobileFocus?.dualSide ?? 'recipient'
  const setDualSide = mobileFocus?.setDualSide
  const recipientsToolbarState = useAppSelector(
    selectActiveRecipientsToolbarState,
  )
  const {
    assemblySenderSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
  } = useMobileFactoryListChrome()
  const pendingAddressAddFocusRef = useRef<'recipient' | null>(null)

  useEffect(() => {
    if (!isMobile || setDualSide == null) return
    setDualSide('recipient')
  }, [isMobile, setDualSide])

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

    if (recipientView === 'recipientView') {
      mobileFocus.setDualSide('recipient')
      mobileFocus.clearFocus()
      pendingAddressAddFocusRef.current = null
      return
    }

    if (recipientView === 'recipientCreate') {
      pendingAddressAddFocusRef.current = null
    }
  }, [isMobile, mobileFocus, recipientView])

  const handleAddressAddClick = useCallback(
    (section: 'sender' | 'recipients', key: IconKey): void | false => {
      if (key !== 'addressAdd' || !isMobile || mobileFocus == null) return
      if (section !== 'recipients') return

      if (recipientView === 'recipientCreate') return
      if (recipientViewEditMode) return false

      const { state: addState } = readAddressAddToolbarMeta(
        recipientsToolbarState,
      )

      if (addState === 'active') {
        mobileFocus.setDualSide('recipient')
        mobileFocus.clearFocus()
        return false
      }

      if (addState === 'enabled') {
        pendingAddressAddFocusRef.current = 'recipient'
        if (recipientView === 'recipientView') {
          mobileFocus.setDualSide('recipient')
          mobileFocus.clearFocus()
        }
      }
    },
    [
      isMobile,
      mobileFocus,
      recipientView,
      recipientViewEditMode,
      recipientsToolbarState,
    ],
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

  const showFocusReturn =
    isMobile && focusRole === 'recipient' && mobileFocus != null
  const bothFormsApplied =
    assemblySenderSimplifiedPeek && assemblyRecipientSimplifiedPeek
  const recipientsToolbarSlotDisabled = recipientView === 'recipientCreate'

  const handleFocusReturn = useCallback(
    (key: IconKey): void | false => {
      if (key !== 'return' || mobileFocus == null || focusRole == null) return

      if (recipientViewEditMode) return false

      mobileFocus.clearFocus()
      return false
    },
    [mobileFocus, focusRole, recipientViewEditMode],
  )

  const recipientsToolbar = assemblyRecipientSimplifiedPeek ? (
    <Toolbar
      section="recipients"
      groupsOverride={ADDRESS_APPLY_PEEK_TOOLBAR}
      onActionClick={handleRecipientApplyPeekClick}
    />
  ) : (
    <Toolbar
      section="recipients"
      stateOverride={recipientsToolbarState}
      groupsOverride={
        !isMobile &&
        recipientView === 'recipientsView' &&
        recipientsFormViewIdsCount > 1
          ? RECIPIENTS_TOOLBAR_WITH_LIST_CLOSE
          : undefined
      }
      onActionClick={(key) => handleAddressAddClick('recipients', key)}
    />
  )

  /**
   * Role fade on upper row (same recipe as lower View).
   * Dual toggle may be hidden while one side is Apply-peek — still tint by pinned dualSide.
   * Both Apply-peek → neutral complete class (not sender/recipient).
   */
  const upperToolbarRoleFade =
    showFocusReturn && focusRole != null
      ? focusRole
      : bothFormsApplied
        ? null
        : dualSide

  return (
    <div
      className={clsx(
        styles.envelopeToolbarRow,
        showFocusReturn && styles.envelopeToolbarRowAddressFocus,
        upperToolbarRoleFade === 'sender' && styles.envelopeToolbarRowSender,
        upperToolbarRoleFade === 'recipient' &&
          styles.envelopeToolbarRowRecipient,
        bothFormsApplied &&
          !showFocusReturn &&
          styles.envelopeToolbarRowComplete,
      )}
    >
      {showFocusReturn ? (
        <>
          <div className={styles.envelopeToolbarFocusLeft}>
            {recipientsToolbar}
          </div>
          <div className={styles.envelopeToolbarFocusReturn}>
            <Toolbar
              section="recipientView"
              groupsOverride={ENVELOPE_MOBILE_ADDRESS_VIEW_UPPER_RETURN_TOOLBAR}
              className={toolbarStyles.toolbarAromaUpperReturn}
              onActionClick={handleFocusReturn}
            />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            styles.envelopeToolbarSlotRecipients,
            recipientsToolbarSlotDisabled &&
              styles.envelopeToolbarSlotDisabled,
          )}
        >
          {recipientsToolbar}
        </div>
      )}
    </div>
  )
}
