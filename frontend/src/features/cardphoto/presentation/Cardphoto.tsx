import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { CardphotoView } from './CardphotoView/CardphotoView'
import styles from './Cardphoto.module.scss'

export const Cardphoto = () => {
  const { activeImage, cropQualityProgress } = useCardphotoFacade()
  const hasLoadedPhoto = Boolean(activeImage)
  console.log('cardphoto cropQualityProgress', cropQualityProgress)

  return (
    <div className={styles.cardphoto}>
      <div className={styles.cardphotoViewWrap}>
        <div className={styles.cardphotoToolbarRow}>
          {hasLoadedPhoto ? <Toolbar section="cardphotoEditor" /> : null}
        </div>
        <div className={styles.cardphotoViewContent}>
          <CardphotoView />
        </div>
      </div>
    </div>
  )
}
