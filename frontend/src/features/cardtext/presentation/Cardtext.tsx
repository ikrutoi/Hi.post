import React from 'react'
import { CardEditor } from './CardEditor/CardEditor'
import styles from './Cardtext.module.scss'

interface CardtextProps {
  styleLeft: number
}

export const Cardtext: React.FC<CardtextProps> = ({
  // toolbarColor,
  styleLeft,
}) => {
  return (
    <div className={styles.cardtext}>
      <CardEditor
      // toolbarColor={toolbarColor}
      // styleLeft={styleLeft}
      />
    </div>
  )
}
