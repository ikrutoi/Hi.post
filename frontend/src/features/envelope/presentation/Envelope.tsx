import React from 'react'
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
import { EnvelopeInnerToolbar } from './EnvelopeInnerToolbar'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()
  const lang = getSafeLang(i18n.language)
  const senderFacade = useSenderFacade()
  const {
    rightPieEnvelopePeekNoToolbar,
    listRowLocalId,
    listRowPostcardStatus,
  } = useRightListArchiveMini()

  const envelopeWorkZone = (
    <div className={styles.envelopeWorkZone}>
      <div className={styles.envelopeTopSlot}>
        <div className={styles.envelopeLogo} />
        <div className={styles.envelopeMark}>
          <Mark
            simplifiedPeek={rightPieEnvelopePeekNoToolbar}
            listArchivePostcardStatus={listRowPostcardStatus}
          />
        </div>
        <div
          className={clsx(styles.envelopeSection, styles.envelopeSectionSender)}
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
      <div className={styles.envelopeBottomSlot}>
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

      <div className={styles.envelopeSenderToggle}>
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

      <div className={styles.envelopeRecipientToggle}>
        <div className={styles.envelopeFooterSpacer} aria-hidden />
      </div>
    </div>
  )

  const body = (
    <div className={styles.envelope}>
      <div className={styles.envelopeViewWrap}>
        {rightPieEnvelopePeekNoToolbar ? (
          <div className={styles.envelopeToolbarRow} aria-hidden />
        ) : (
          <EnvelopeInnerToolbar />
        )}
        <div className={styles.envelopeViewContent}>{envelopeWorkZone}</div>
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
