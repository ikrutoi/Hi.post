import React from 'react'
import clsx from 'clsx'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { RecipientListPanel } from '../addressBook/presentation/RecipientListPanel'
import { SenderListPanel } from '../addressBook/presentation/SenderListPanel'
import { useRecipientFacade } from '../recipient/application/facades'
import { useSenderFacade } from '../sender/application/facades'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const lang = getSafeLang(i18n.language)
  const recipientFacade = useRecipientFacade()
  const senderFacade = useSenderFacade()

  console.log('recipientFacade', recipientFacade.state)

  return (
    <div className={styles.envelope}>
      <div className={styles.envelopeLeftSlot}>
        {recipientFacade.listPanelOpen ? (
          <div className={styles.recipientListPanelWrap}>
            <RecipientListPanel
              onSelect={recipientFacade.selectFromList}
              selectedIds={recipientFacade.listSelectedIds}
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
      <div className={styles.envelopeRightSlot}>
        {senderFacade.listPanelOpen ? (
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
    </div>
  )
}
