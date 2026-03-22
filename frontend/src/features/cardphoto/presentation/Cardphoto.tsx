import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { CardphotoView } from './CardphotoView/CardphotoView'
import styles from './Cardphoto.module.scss'

const photoToolbarSection = (isProcessed: boolean) =>
  isProcessed ? 'cardphotoProcessed' : 'cardphotoCreate'

export const Cardphoto = () => {
  const { activeImage, cropQualityProgress, isProcessedMode } =
    useCardphotoFacade()
  const hasLoadedPhoto = Boolean(activeImage)
  console.log('cardphoto cropQualityProgress', cropQualityProgress)
  console.log('cardphoto activeImage', activeImage)

  return (
    <div className={styles.cardphoto}>
      <div className={styles.cardphotoViewWrap}>
        <div className={styles.cardphotoToolbarRow}>
          {hasLoadedPhoto ? (
            <Toolbar section={photoToolbarSection(isProcessedMode)} />
          ) : null}
        </div>
        <div className={styles.cardphotoViewContent}>
          <CardphotoView />
        </div>
      </div>
    </div>
  )
}
