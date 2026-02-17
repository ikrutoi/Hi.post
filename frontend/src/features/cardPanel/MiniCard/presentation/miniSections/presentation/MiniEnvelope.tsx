import React from 'react'
import clsx from 'clsx'
import { MiniAddress } from './MiniAddress/MiniAddress'
import { Mark } from '@/features/envelope/view/presentation'
import { useSenderFacade } from '@envelope/sender/application/facades'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import styles from './MiniEnvelope.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { getToolbarIcon } from '@/shared/utils/icons'

export const MiniEnvelope: React.FC = () => {
  const { state: stateSender } = useSenderFacade()
  const { address: addressSender, isEnabled } = stateSender
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('envelope')

  const { state: stateRecipient } = useRecipientFacade()
  const { address: addressRecipient } = stateRecipient

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
      <button
        className={clsx(styles.previewButton, styles.previewButtonDelete)}
        aria-label="Delete section content"
        onClick={(e) => {
          e.stopPropagation()
          // removeCropId(cropId)
        }}
      >
        {getToolbarIcon({ key: 'deleteSmall' })}
      </button>
    </div>
  )
}
