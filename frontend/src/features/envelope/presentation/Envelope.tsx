import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { EnvelopePeekAddressBlock } from './EnvelopePeekAddressBlock'
import { useSenderFacade } from '../sender/application/facades'
import { useRecipientFacade } from '../recipient/application/facades'
import { IconUserSenderCentered } from '@shared/ui/icons'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { EnvelopeMobileAddressForm } from './EnvelopeMobileAddressForm'
import { EnvelopeInnerToolbar } from './EnvelopeInnerToolbar'
import { EnvelopeMobileAddressViewToolbar } from './EnvelopeMobileAddressViewToolbar'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
import { useArchiveEditPeekGate } from '@cardPanel/application/hooks/useArchiveEditPeekGate'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useAppSelector } from '@app/hooks'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { selectSenderView, selectSenderAddressFormData } from '../sender/infrastructure/selectors'
import { selectRecipientView, selectRecipientAddressFormData } from '../recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxSender,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
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
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()
  const lang = getSafeLang(i18n.language)
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()
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
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const mobileFocusRole = mobileFocus?.focusRole ?? null
  const dualSide = mobileFocus?.dualSide ?? 'sender'
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
  const showSenderSimplified =
    !envelopePeekMode && assemblySenderSimplifiedPeek
  const showRecipientSimplified =
    !envelopePeekMode && assemblyRecipientSimplifiedPeek
  const bothFormsApplied =
    assemblySenderSimplifiedPeek && assemblyRecipientSimplifiedPeek

  const sessionSenderViewDraft = useAppSelector(selectSenderAddressFormData)
  const sessionRecipientViewDraft = useAppSelector(
    selectRecipientAddressFormData,
  )
  /** What’s on the envelope form (viewDraft), not addressAdd formDraft leftovers. */
  const senderVisibleAddress = (
    sandboxActive ? sandboxSender.viewDraft : sessionSenderViewDraft
  ) as AddressFields
  const recipientVisibleAddress = (
    sandboxActive ? sandboxRecipient.viewDraft : sessionRecipientViewDraft
  ) as AddressFields
  /**
   * Solo only when the visible form has an incomplete address.
   * Empty placeholder (even with leftover addressAdd formDraft) keeps chrome visible.
   */
  const hasIncompleteVisibleSender =
    !isAddressDraftEmpty(senderVisibleAddress) &&
    !isAddressDraftComplete(senderVisibleAddress)
  const hasIncompleteVisibleRecipient =
    !isAddressDraftEmpty(recipientVisibleAddress) &&
    !isAddressDraftComplete(recipientVisibleAddress)
  const addressAddSoloRole =
    isMobile &&
    !envelopePeekMode &&
    !bothFormsApplied &&
    dualSide === 'sender' &&
    hasIncompleteVisibleSender
      ? ('sender' as const)
      : isMobile &&
          !envelopePeekMode &&
          !bothFormsApplied &&
          dualSide === 'recipient' &&
          hasIncompleteVisibleRecipient
        ? ('recipient' as const)
        : null

  const showDualSideSelectionBorder =
    isMobile &&
    !envelopePeekMode &&
    !bothFormsApplied &&
    senderView !== 'senderCreate' &&
    recipientView !== 'recipientCreate'

  const mobileFormRole =
    senderView === 'senderCreate'
      ? ('sender' as const)
      : recipientView === 'recipientCreate'
        ? ('recipient' as const)
        : null

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
    if (
      senderView === 'senderCreate' ||
      recipientView === 'recipientCreate'
    ) {
      mobileFocus?.clearFocus()
    }
  }, [senderView, recipientView, mobileFocus])

  const prevSenderViewRef = useRef(senderView)
  const prevRecipientViewRef = useRef(recipientView)

  useEffect(() => {
    if (
      mobileFocusRole === 'sender' &&
      prevSenderViewRef.current === 'senderView' &&
      senderView !== 'senderView'
    ) {
      mobileFocus?.clearFocus()
    }
    prevSenderViewRef.current = senderView
  }, [senderView, mobileFocusRole, mobileFocus])

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
            showDualSideSelectionBorder &&
              dualSide === 'sender' &&
              styles.envelopeSectionSenderDualSelected,
            showDualSideSelectionBorder &&
              dualSide !== 'sender' &&
              !showSenderSimplified &&
              styles.envelopeSectionDualUnfocused,
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
          ) : showSenderSimplified ? (
            <EnvelopePeekAddressBlock
              key="peek-env-sender-simplified"
              role="sender"
              compact={isMobile}
              fromSessionApplied
              /** Toggle off Apply = confirm no sender; keep form draft, do not show it in peek. */
              addressFallback={
                senderFacade.isEnabled ? senderFacade.address : null
              }
              className={styles.envelopePeekBlock}
            />
          ) : (
            <EnvelopeAddress role="sender" roleLabel="Sender" lang={lang} />
          )}
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
            showDualSideSelectionBorder &&
              dualSide === 'recipient' &&
              styles.envelopeSectionRecipientDualSelected,
            showDualSideSelectionBorder &&
              dualSide !== 'recipient' &&
              !showRecipientSimplified &&
              styles.envelopeSectionDualUnfocused,
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
        {envelopePeekMode || showSenderSimplified ? (
          <div className={styles.envelopeFooterSpacer} aria-hidden />
        ) : (
          <div
            className={clsx(
              styles.envelopeSenderToggleGroup,
              senderFacade.isEnabled && styles.envelopeSenderToggleGroupActive,
            )}
          >
            <Toggle
              label=""
              checked={senderFacade.isEnabled}
              onChange={senderFacade.toggleEnabled}
              size="default"
              variant="envelopeSender"
              ariaLabel="Include sender"
            />
            <IconUserSenderCentered
              className={styles.envelopeSenderToggleIcon}
            />
          </div>
        )}
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
        {!isMobile &&
          (envelopePeekMode ? (
            <div
              className={clsx(
                styles.envelopeToolbarRow,
                styles.envelopeToolbarRowEmpty,
              )}
              aria-hidden
            />
          ) : showMobileAddressForm ? null : (
            showEnvelopeToolbar ? (
              <EnvelopeInnerToolbar />
            ) : null
          ))}
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
