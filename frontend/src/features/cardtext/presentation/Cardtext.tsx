import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { CardEditor } from './CardEditor/CardEditor'
import { useLayoutFacade } from '@layout/application/facades'
// import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import styles from './Cardtext.module.scss'

interface CardtextProps {
  styleLeft: number
}

export const Cardtext: React.FC<CardtextProps> = ({
  // toolbarColor,
  styleLeft,
}) => {
  const { size } = useLayoutFacade()
  const { sizeCard } = size
  // const widthRenderer = sizeCard.height * CARD_SCALE_CONFIG.aspectRatio

  return (
    <div className={styles.cardtextContainer}>
      {/* <Toolbar section="cardtext" /> */}
      <div
        className={styles.cardtext}
        style={{
          width: `${sizeCard.width}px`,
          height: `${sizeCard.height}px`,
        }}
      >
        <CardEditor
        // toolbarColor={toolbarColor}
        // styleLeft={styleLeft}
        />
      </div>
    </div>
  )
}
