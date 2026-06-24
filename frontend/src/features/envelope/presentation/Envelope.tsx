import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { EnvelopePeekAddressBlock } from './EnvelopePeekAddressBlock'
import { useSenderFacade } from '../sender/application/facades'
import { IconUserSenderCentered } from '@shared/ui/icons'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { EnvelopeMobileAddressForm } from './EnvelopeMobileAddressForm'
import { EnvelopeInnerToolbar } from './EnvelopeInnerToolbar'
import { EnvelopeMobileAddressViewToolbar } from './EnvelopeMobileAddressViewToolbar'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
import { useAppSelector } from '@app/hooks'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { selectSenderView } from '../sender/infrastructure/selectors'
import { selectRecipientView } from '../recipient/infrastructure/selectors'
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
  const isMobile = useAppSelector(selectIsMobileLayout)
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const mobileFocusRole = mobileFocus?.focusRole ?? null
  const {
    rightPieEnvelopePeekNoToolbar,
    listRowLocalId,
    listRowPostcardStatus,
  } = useRightListArchiveMini()

  const mobileFormRole =
    senderView === 'senderCreate'
      ? ('sender' as const)
      : recipientView === 'recipientCreate'
        ? ('recipient' as const)
        : null

  const showMobileAddressForm =
    isMobile &&
    mobileFormRole != null &&
    !rightPieEnvelopePeekNoToolbar

  const showMobileAddressFocus =
    isMobile &&
    mobileFocusRole != null &&
    !showMobileAddressForm &&
    !rightPieEnvelopePeekNoToolbar

  useEffect(() => {
    if (!isMobile || showMobileAddressForm || rightPieEnvelopePeekNoToolbar) {
      mobileFocus?.clearFocus()
    }
  }, [
    isMobile,
    showMobileAddressForm,
    rightPieEnvelopePeekNoToolbar,
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
            simplifiedPeek={rightPieEnvelopePeekNoToolbar}
            listArchivePostcardStatus={listRowPostcardStatus}
          />
        </div>
        <div
          className={clsx(styles.envelopeSection, styles.envelopeSectionSender)}
          data-envelope-mobile-focus-sender
        >
          {rightPieEnvelopePeekNoToolbar ? (
            <EnvelopePeekAddressBlock
              key={
                listRowLocalId != null
                  ? `peek-env-sender-${listRowLocalId}`
                  : 'peek-env-sender'
              }
              role="sender"
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
          )}
        >
          {rightPieEnvelopePeekNoToolbar ? (
            <EnvelopePeekAddressBlock
              key={
                listRowLocalId != null
                  ? `peek-env-recipient-${listRowLocalId}`
                  : 'peek-env-recipient'
              }
              role="recipient"
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
        {rightPieEnvelopePeekNoToolbar ? (
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
    !rightPieEnvelopePeekNoToolbar && !showMobileAddressForm

  const body = (
    <div
      className={styles.envelope}
      data-envelope-mobile-form={showMobileAddressForm ? 'true' : undefined}
      data-envelope-mobile-focus={showMobileAddressFocus ? mobileFocusRole! : undefined}
    >
      <div className={styles.envelopeViewWrap}>
        {!isMobile &&
          (rightPieEnvelopePeekNoToolbar ? (
            <div className={styles.envelopeToolbarRow} aria-hidden />
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

  return rightPieEnvelopePeekNoToolbar ? (
    notebookTabsOuter ? (
      body
    ) : (
      <NotebookPeekShell>{body}</NotebookPeekShell>
    )
  ) : (
    body
  )
}
