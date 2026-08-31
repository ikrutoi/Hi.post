import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { EnvelopePeekAddressBlock } from './EnvelopePeekAddressBlock'
import { useRecipientFacade } from '../recipient/application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { EnvelopeMobileAddressForm } from './EnvelopeMobileAddressForm'
import { EnvelopeMobileAddressViewToolbar } from './EnvelopeMobileAddressViewToolbar'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
import { useArchiveEditPeekGate } from '@cardPanel/application/hooks/useArchiveEditPeekGate'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import {
  selectSenderView,
  selectIsSenderEnabled,
} from '../sender/infrastructure/selectors'
import { setEnabled, setSenderApplied, setSenderView } from '../sender/infrastructure/state'
import { selectRecipientView, selectRecipientAddressFormData } from '../recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxSender,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import {
  setArchiveSenderApplied,
  setArchiveSenderEnabled,
  setArchiveSenderView,
} from '@cardPanel/infrastructure/state'
import {
  isAddressDraftComplete,
  isAddressDraftEmpty,
} from '@envelope/domain/helpers'
import type { AddressFields } from '@shared/config/constants'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  return <EnvelopeBody cardPuzzleRef={cardPuzzleRef} />
}

const EnvelopeBody: React.FC<EnvelopeProps> = ({ cardPuzzleRef: _cardPuzzleRef }) => {
  const dispatch = useAppDispatch()
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()
  const lang = getSafeLang(i18n.language)
  const recipientFacade = useRecipientFacade()
  const isMobile = useAppSelector(selectIsMobileLayout)
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxSender = useAppSelector(selectArchiveSandboxSender)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const sessionSenderView = useAppSelector(selectSenderView)
  const sessionRecipientView = useAppSelector(selectRecipientView)
  const sessionSenderEnabled = useAppSelector(selectIsSenderEnabled)
  const sessionSenderAppliedLocked = useAppSelector(
    (s) => s.sender.appliedLocked === true,
  )
  const senderView = sandboxActive
    ? sandboxSender.currentView
    : sessionSenderView
  const recipientView = sandboxActive
    ? sandboxRecipient.currentView
    : sessionRecipientView
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const mobileFocusRole = mobileFocus?.focusRole ?? null
  const {
    rightPieEnvelopePeekNoToolbar,
    listRowLocalId,
    listRowPostcardStatus,
  } = useRightListArchiveMini()
  const archiveEditPeekGate = useArchiveEditPeekGate('envelope')
  const {
    assemblySenderSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
    archiveCartEnvelopeSimplifiedPeek,
  } = useMobileFactoryListChrome()
  /**
   * Cart envelope: session apply-peek like left (not list-row peek UI).
   * Peek flag only hides cart list / keeps right chrome.
   */
  const envelopePeekMode =
    (rightPieEnvelopePeekNoToolbar && !archiveCartEnvelopeSimplifiedPeek) ||
    archiveEditPeekGate
  const showRecipientSimplified =
    !envelopePeekMode && assemblyRecipientSimplifiedPeek
  const bothFormsApplied =
    assemblySenderSimplifiedPeek && assemblyRecipientSimplifiedPeek

  const sessionRecipientViewDraft = useAppSelector(
    selectRecipientAddressFormData,
  )
  const recipientVisibleAddress = (
    sandboxActive ? sandboxRecipient.viewDraft : sessionRecipientViewDraft
  ) as AddressFields
  const hasIncompleteVisibleRecipient =
    !isAddressDraftEmpty(recipientVisibleAddress) &&
    !isAddressDraftComplete(recipientVisibleAddress)
  const addressAddSoloRole =
    isMobile &&
    !envelopePeekMode &&
    !bothFormsApplied &&
    hasIncompleteVisibleRecipient
      ? ('recipient' as const)
      : null

  const mobileFormRole =
    recipientView === 'recipientCreate' ? ('recipient' as const) : null

  const showMobileAddressForm =
    isMobile &&
    mobileFormRole != null &&
    !envelopePeekMode

  const showMobileAddressFocus =
    isMobile &&
    addressAddSoloRole != null &&
    !showMobileAddressForm &&
    !envelopePeekMode

  useEffect(() => {
    if (!isMobile || showMobileAddressForm || envelopePeekMode) {
      mobileFocus?.clearFocus()
    }
  }, [
    isMobile,
    showMobileAddressForm,
    envelopePeekMode,
    mobileFocus,
  ])

  useEffect(() => {
    if (recipientView === 'recipientCreate') {
      mobileFocus?.clearFocus()
    }
  }, [recipientView, mobileFocus])

  const prevRecipientViewRef = useRef(recipientView)

  useEffect(() => {
    if (
      mobileFocusRole === 'recipient' &&
      prevRecipientViewRef.current === 'recipientView' &&
      recipientView !== 'recipientView'
    ) {
      mobileFocus?.clearFocus()
    }
    prevRecipientViewRef.current = recipientView
  }, [recipientView, mobileFocusRole, mobileFocus])

  useEffect(() => {
    if (mobileFocus == null) return
    if (mobileFocus.dualSide !== 'recipient') {
      mobileFocus.setDualSide('recipient')
    }
    if (mobileFocus.focusRole === 'sender') {
      mobileFocus.clearFocus()
    }
  }, [mobileFocus])

  /**
   * Sender form is removed: confirm “no sender” so envelope completion
   * still depends only on the recipient Apply.
   */
  useEffect(() => {
    if (envelopePeekMode) return
    const appliedLocked = sandboxActive
      ? sandboxSender.appliedLocked === true
      : sessionSenderAppliedLocked
    const enabled = sandboxActive
      ? sandboxSender.enabled === true
      : sessionSenderEnabled
    const view = sandboxActive ? sandboxSender.currentView : senderView
    if (view === 'senderCreate') {
      if (sandboxActive) dispatch(setArchiveSenderView('senderView'))
      else dispatch(setSenderView('senderView'))
    }
    if (enabled) {
      if (sandboxActive) dispatch(setArchiveSenderEnabled(false))
      else dispatch(setEnabled(false))
    }
    if (!appliedLocked) {
      if (sandboxActive) dispatch(setArchiveSenderApplied(true))
      else dispatch(setSenderApplied(true))
    }
  }, [
    dispatch,
    envelopePeekMode,
    sandboxActive,
    sandboxSender.appliedLocked,
    sandboxSender.enabled,
    sandboxSender.currentView,
    sessionSenderAppliedLocked,
    sessionSenderEnabled,
    senderView,
  ])

  const envelopeWorkZone = (
    <div className={styles.envelopeWorkZone}>
      <div className={styles.envelopeTopSlot}>
        <div
          className={styles.envelopeLogo}
          data-envelope-mobile-focus-chrome
        />
        <div
          className={styles.envelopeMark}
          data-envelope-mobile-focus-chrome
        >
          <Mark
            simplifiedPeek={envelopePeekMode}
            listArchivePostcardStatus={listRowPostcardStatus}
          />
        </div>
        <div
          className={clsx(
            styles.envelopeSection,
            styles.envelopeSectionSender,
          )}
          data-envelope-mobile-focus-sender
        >
          {envelopePeekMode ? (
            <EnvelopePeekAddressBlock
              key={
                listRowLocalId != null
                  ? `peek-env-sender-${listRowLocalId}`
                  : 'peek-env-sender'
              }
              role="sender"
              compact={isMobile}
              className={styles.envelopePeekBlock}
            />
          ) : null}
        </div>
      </div>
      <div
        className={styles.envelopeBottomSlot}
        data-envelope-mobile-focus-recipient
      >
        <div
          className={clsx(
            styles.envelopeSection,
            styles.envelopeSectionRecipient,
          )}
        >
          {envelopePeekMode ? (
            <EnvelopePeekAddressBlock
              key={
                listRowLocalId != null
                  ? `peek-env-recipient-${listRowLocalId}`
                  : 'peek-env-recipient'
              }
              role="recipient"
              compact={isMobile}
              className={styles.envelopePeekBlock}
            />
          ) : showRecipientSimplified ? (
            <EnvelopePeekAddressBlock
              key="peek-env-recipient-simplified"
              role="recipient"
              compact={isMobile}
              fromSessionApplied
              addressFallback={recipientFacade.address}
              className={styles.envelopePeekBlock}
            />
          ) : (
            <EnvelopeAddress
              role="recipient"
              roleLabel="Recipients"
              lang={lang}
            />
          )}
        </div>
      </div>

      <div
        className={styles.envelopeSenderToggle}
        data-envelope-mobile-focus-chrome
      >
        <div className={styles.envelopeFooterSpacer} aria-hidden />
      </div>

      <div
        className={styles.envelopeRecipientToggle}
        data-envelope-mobile-focus-chrome
      >
        <div className={styles.envelopeFooterSpacer} aria-hidden />
      </div>
    </div>
  )

  const showEnvelopeToolbar =
    !envelopePeekMode && !showMobileAddressForm

  const body = (
    <div
      className={styles.envelope}
      data-envelope-mobile-form={showMobileAddressForm ? 'true' : undefined}
      data-envelope-mobile-focus={
        showMobileAddressFocus ? addressAddSoloRole! : undefined
      }
    >
      <div className={styles.envelopeViewWrap}>
        <EnvelopeMobileAddressViewToolbar enabled={showEnvelopeToolbar} />
        <div className={styles.envelopeViewContent}>
          {showMobileAddressForm && mobileFormRole != null ? (
            <EnvelopeMobileAddressForm role={mobileFormRole} lang={lang} />
          ) : (
            envelopeWorkZone
          )}
        </div>
      </div>
    </div>
  )

  return envelopePeekMode ? (
    notebookTabsOuter ? (
      body
    ) : (
      <NotebookPeekShell>{body}</NotebookPeekShell>
    )
  ) : (
    body
  )
}
