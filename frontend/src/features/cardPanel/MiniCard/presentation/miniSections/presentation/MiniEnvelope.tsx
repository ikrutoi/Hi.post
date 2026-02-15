import React from 'react'
import clsx from 'clsx'
import { MiniAddress } from './MiniAddress/MiniAddress'
import { Mark } from '@/features/envelope/view/presentation'
import { useSenderFacade } from '@envelope/sender/application/facades'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import styles from './MiniEnvelope.module.scss'

export const MiniEnvelope: React.FC = () => {
  const { state: stateSender } = useSenderFacade()
  const { address: addressSender, isEnabled } = stateSender

  const { state: stateRecipient } = useRecipientFacade()
  const { address: addressRecipient } = stateRecipient

  return (
    <div className={styles.miniEnvelope}>
      <div className={styles.miniEnvelopeLogo} />
      {/* <div className={styles.miniEnvelopeMack}>
        <Mark />
      </div> */}
      <div
        className={clsx(
          styles.miniEnvelopeAddress,
          styles.miniEnvelopeRecipient,
        )}
      >
        <MiniAddress
          role="recipient"
          roleLabel="Recipient"
          value={addressRecipient}
        />
      </div>
    </div>
  )
}
