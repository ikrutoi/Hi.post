import React from 'react'
import clsx from 'clsx'
import { MiniAddress } from './MiniAddress/MiniAddress'
import { Mark } from '@/features/envelope/view/presentation'
import styles from './MiniEnvelope.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { getToolbarIcon } from '@/shared/utils/icons'
import { useEnvelopeFacade } from '@envelope/application/facades'

export const MiniEnvelope: React.FC = () => {
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('envelope')
  const { addressRecipient, fullClear } = useEnvelopeFacade()

  return (
    <div
      className={clsx(
        styles.miniEnvelope,
        styles.visible,
        isHovered && styles.hovered,
      )}
      onMouseEnter={() => setHovered('envelope')}
      onMouseLeave={() => setHovered(null)}
    >
      <div className={styles.miniEnvelopeLogo}></div>
      {/* <div className={styles.miniEnvelopeMack}>
        <Mark />
      </div> */}
      <div
        className={clsx(
          styles.miniEnvelopeAddress,
          styles.miniEnvelopeName,
          // styles.miniEnvelopeRecipient,
        )}
      >
        {addressRecipient.name}

        {/* <MiniAddress
          role="recipient"
          roleLabel="Recipient"
          value={addressRecipient}
        /> */}
      </div>
      <div
        className={clsx(
          styles.miniEnvelopeAddress,
          styles.miniEnvelopeCity,
          // styles.miniEnvelopeRecipient,
        )}
      >
        {addressRecipient.city}

        {/* <MiniAddress
          role="recipient"
          roleLabel="Recipient"
          value={addressRecipient}
        /> */}
      </div>
      <button
        className={clsx(styles.previewButton, styles.previewButtonDelete)}
        aria-label="Delete section content"
        onClick={(e) => {
          e.stopPropagation()
          fullClear()
        }}
      >
        {getToolbarIcon({ key: 'clearInput' })}
      </button>
    </div>
  )
}
