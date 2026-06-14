import React from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import { selectRecipientsToolbarStateWithLiveAddressList } from '@envelope/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { useSenderFacade } from '@envelope/sender/application/facades'
import styles from './Envelope.module.scss'

export const EnvelopeInnerToolbar: React.FC = () => {
  const senderFacade = useSenderFacade()
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)
  const recipientsToolbarStateWithLiveAddressList = useAppSelector(
    selectRecipientsToolbarStateWithLiveAddressList,
  )

  return (
    <div className={styles.envelopeToolbarRow}>
      <div
        className={clsx(
          styles.envelopeToolbarSlotSender,
          senderView === 'senderCreate' && styles.envelopeToolbarSlotDisabled,
        )}
      >
        {senderFacade.isEnabled ? <Toolbar section="sender" /> : null}
      </div>
      <div
        className={clsx(
          styles.envelopeToolbarSlotRecipients,
          recipientView === 'recipientCreate' &&
            styles.envelopeToolbarSlotDisabled,
        )}
      >
        <Toolbar
          section="recipients"
          stateOverride={recipientsToolbarStateWithLiveAddressList}
        />
      </div>
    </div>
  )
}
