import React from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import { selectRecipientsToolbarStateWithLiveAddressList } from '@envelope/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
import styles from './Envelope.module.scss'

export const EnvelopeInnerToolbar: React.FC = () => {
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const focusRole = mobileFocus?.focusRole ?? null
  const recipientsToolbarStateWithLiveAddressList = useAppSelector(
    selectRecipientsToolbarStateWithLiveAddressList,
  )

  const showSenderSlot = focusRole !== 'sender'
  const showRecipientsSlot = focusRole !== 'recipient'

  return (
    <div className={styles.envelopeToolbarRow}>
      {showSenderSlot ? (
        <div
          className={clsx(
            styles.envelopeToolbarSlotSender,
            focusRole === 'recipient' && styles.envelopeToolbarSlotFocusedOnly,
            senderView === 'senderCreate' && styles.envelopeToolbarSlotDisabled,
          )}
        >
          <Toolbar section="sender" />
        </div>
      ) : null}
      {showRecipientsSlot ? (
        <div
          className={clsx(
            styles.envelopeToolbarSlotRecipients,
            focusRole === 'sender' && styles.envelopeToolbarSlotFocusedOnly,
            recipientView === 'recipientCreate' &&
              styles.envelopeToolbarSlotDisabled,
          )}
        >
          <Toolbar
            section="recipients"
            stateOverride={recipientsToolbarStateWithLiveAddressList}
          />
        </div>
      ) : null}
    </div>
  )
}
