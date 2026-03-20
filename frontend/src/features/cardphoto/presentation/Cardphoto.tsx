import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { CardphotoView } from './CardphotoView/CardphotoView'
import styles from './Cardphoto.module.scss'

export const Cardphoto = () => {
  return (
    <div className={styles.cardphoto}>
      <div className={styles.cardphotoViewWrap}>
        <div className={styles.cardphotoToolbarRow}>
          <Toolbar section="cardphotoCreate" />
        </div>
        <div className={styles.cardphotoViewContent}>
          <CardphotoView />
        </div>
      </div>
    </div>
  )
}
