import React from 'react'
import { CardEditor } from '../CardEditor'
import { CardtextProps } from '@/features/cardtext/model/types'

import styles from './Cardtext.module.scss'

export const Cardtext: React.FC<CardtextProps> = ({
  toolbarColor,
  styleLeftCardPuzzle,
}) => {
  return (
    <div className={styles.cardtext}>
      <CardEditor
        toolbarColor={toolbarColor}
        styleLeftCardPuzzle={styleLeftCardPuzzle}
      />
    </div>
  )
}
