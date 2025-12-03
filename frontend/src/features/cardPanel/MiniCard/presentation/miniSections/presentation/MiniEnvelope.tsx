import React from 'react'
import clsx from 'clsx'
// import { useMiniEnvelope } from '../application/hooks'
import { MiniAddress } from './MiniAddress/MiniAddress'
import { useEnvelopeFacade } from '@envelope/application/facades'
// import { useAddressFacade } from '@envelope/addressForm/application/facades'
import styles from './MiniEnvelope.module.scss'

export const MiniEnvelope: React.FC = () => {
  // const { sender, recipient, senderLabels, recipientLabels } = useMiniEnvelope()

  const { state: stateEnvelope } = useEnvelopeFacade()
  // const { getRoleFields, envelope } = stateEnvelope
  // const valueSender = getRoleFields('sender')
  // const valueRecipient = getRoleFields('recipient')

  // const { state: stateRecipientAddress } = useAddressFacade('recipient')
  // const { address } = stateRecipientAddress

  // console.log('valueEnvelope', envelope)
  // console.log('valueRecipient', valueRecipient)

  return (
    <div className={styles.miniEnvelope}>
      <div className={styles.miniEnvelopeLogoContainer}>
        <span className={styles.miniEnvelopeLogo} />
      </div>
      <div
        className={clsx(styles.miniEnvelopeAddress, styles.miniEnvelopeSender)}
      >
        {/* <MiniAddress role="sender" values={sender} labelLayout={senderLabels} /> */}
      </div>

      <div
        className={clsx(
          styles.miniEnvelopeAddress,
          styles.miniEnvelopeRecipient
        )}
      >
        {/* <MiniAddress
          role="recipient"
          values={recipient}
          labelLayout={recipientLabels}
        /> */}
      </div>
    </div>
  )
}
