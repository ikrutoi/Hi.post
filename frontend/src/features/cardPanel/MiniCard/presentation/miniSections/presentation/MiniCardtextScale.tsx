import React from 'react'
import { Slate, Editable } from 'slate-react'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { useLayoutFacade } from '@layout/application/facades'
import { useMiniCardtext, useMiniCardtextScale } from '../application/hooks'
import styles from './MiniCardtextScale.module.scss'

export const MiniCardtextScale: React.FC = () => {
  const { editor, value, sizeCard, scale } = useMiniCardtextScale()
  const { size } = useLayoutFacade()
  const { sizeMiniCard } = size

  return (
    <div
      className={styles.miniCardtextWrapper}
      style={{
        width: sizeMiniCard.width,
        height: sizeMiniCard.height,
      }}
    >
      <div
        className={styles.miniCardtextScaled}
        style={{
          width: sizeCard.width,
          height: sizeCard.height,
          // transform: `scale(${CARD_SCALE_CONFIG.scaleMiniCard})`,
          transformOrigin: 'top left',
        }}
      >
        <Slate key={JSON.stringify(value)} editor={editor} initialValue={value}>
          <Editable readOnly className={styles.miniCardtextEditable} />
        </Slate>
      </div>
    </div>
  )
}
