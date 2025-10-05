import React from 'react'
import { useMiniEnvelope } from '../application/hooks'
import { MiniAddress } from './MiniAddress/MiniAddress'
import styles from './MiniEnvelope.module.scss'

export const MiniEnvelope: React.FC = () => {
  const { sender, recipient, senderLabels, recipientLabels } = useMiniEnvelope()

  return (
    <div className={styles.miniEnvelope}>
      <div className={styles.miniEnvelope__logoContainer}>
        <span className={styles.miniEnvelope__logo} />
      </div>
      <div
        className={`${styles.miniEnvelope__address} ${styles.miniEnvelope__sender}`}
      >
        <MiniAddress role="sender" values={sender} labelLayout={senderLabels} />
      </div>
      <div
        className={`${styles.miniEnvelope__address} ${styles.miniEnvelope__recipient}`}
      >
        <MiniAddress
          role="recipient"
          values={recipient}
          labelLayout={recipientLabels}
        />
      </div>
    </div>
  )
}
