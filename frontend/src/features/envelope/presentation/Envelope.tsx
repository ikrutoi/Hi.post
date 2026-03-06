import React from 'react'
import clsx from 'clsx'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { RecipientListPanel } from '../addressBook/presentation/RecipientListPanel'
import { SenderListPanel } from '../addressBook/presentation/SenderListPanel'
import { useRecipientFacade } from '../recipient/application/facades'
import { useSenderFacade } from '../sender/application/facades'
import { IconUserSenderCentered, IconUsers } from '@shared/ui/icons'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const lang = getSafeLang(i18n.language)
  const recipientFacade = useRecipientFacade()
  const senderFacade = useSenderFacade()

  const recipientListOpen = recipientFacade.listPanelOpen
  const senderListOpen = senderFacade.listPanelOpen

  console.log('Envelope recipient', recipientFacade.state)
  console.log('Envelope sender', senderFacade.state)

  return (
    <div className={styles.envelope}>
      <div
        className={clsx(
          styles.envelopeLeftSlot,
          recipientListOpen && styles.envelopeLeftSlotFullHeight,
        )}
      >
        {recipientListOpen ? (
          <div className={styles.recipientListPanelWrap}>
            <RecipientListPanel
              onSelect={recipientFacade.selectFromList}
              selectedIds={
                recipientFacade.isEnabled
                  ? recipientFacade.listSelectedIds
                  : recipientFacade.state.recipientViewId
                    ? [recipientFacade.state.recipientViewId]
                    : []
              }
              isRecipientsMode={recipientFacade.isEnabled}
            />
          </div>
        ) : (
          <>
            <div className={styles.envelopeLogo} />
            <div
              className={clsx(
                styles.envelopeSection,
                styles.envelopeSectionSender,
              )}
            >
              <EnvelopeAddress role="sender" roleLabel="Sender" lang={lang} />
            </div>
          </>
        )}
      </div>
      <div
        className={clsx(
          styles.envelopeRightSlot,
          senderListOpen && styles.envelopeRightSlotFullHeight,
        )}
      >
        {senderListOpen ? (
          <div className={styles.senderListPanelWrap}>
            <SenderListPanel
              onSelect={senderFacade.selectFromList}
              selectedId={senderFacade.selectedId}
            />
          </div>
        ) : (
          <>
            <div className={styles.envelopeMark}>
              <Mark />
            </div>
            <div
              className={clsx(
                styles.envelopeSection,
                styles.envelopeSectionRecipient,
              )}
            >
              <EnvelopeAddress
                role="recipient"
                roleLabel="Recipient"
                lang={lang}
              />
            </div>
          </>
        )}
      </div>

      {!recipientListOpen && (
        <div className={styles.envelopeSenderToggle}>
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
            />
            <IconUserSenderCentered
              className={styles.envelopeSenderToggleIcon}
            />
          </div>
        </div>
      )}

      {!senderListOpen && (
        <div className={styles.envelopeRecipientToggle}>
          <div
            className={clsx(
              styles.envelopeRecipientToggleGroup,
              recipientFacade.isEnabled &&
                styles.envelopeRecipientToggleGroupActive,
            )}
          >
            <IconUsers className={styles.envelopeRecipientToggleIcon} />
            <Toggle
              label=""
              checked={recipientFacade.isEnabled}
              onChange={recipientFacade.toggleEnabled}
              size="default"
              variant="envelopeRecipient"
            />
          </div>
        </div>
      )}
    </div>
  )
}
