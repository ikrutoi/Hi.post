import React from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { Toggle } from '@shared/ui/Toggle/Toggle'
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
      <div className={styles.envelopeToolbarSlotSender}>
        <div className={styles.envelopeToolbarSenderToggle}>
          <Toggle
            label=""
            checked={senderFacade.isEnabled}
            onChange={senderFacade.toggleEnabled}
            size="default"
            variant="envelopeSender"
            ariaLabel="Include sender"
          />
        </div>
        <div
          className={clsx(
            styles.envelopeToolbarSenderActions,
            senderView === 'senderCreate' && styles.envelopeToolbarSlotDisabled,
          )}
        >
          <Toolbar section="sender" />
        </div>
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
