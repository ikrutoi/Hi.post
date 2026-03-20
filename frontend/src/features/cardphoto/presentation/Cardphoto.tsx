import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import { selectAppliedImage } from '@cardphoto/infrastructure/selectors'
import { CardphotoView } from './CardphotoView/CardphotoView'
import styles from './Cardphoto.module.scss'

export const Cardphoto = () => {
  const appliedImage = useAppSelector(selectAppliedImage)
  const previewUrl = null
  // const previewUrl = appliedImage?.thumbnail?.url ?? appliedImage?.url ?? null

  return (
    <div className={styles.cardphoto}>
      <div className={styles.cardphotoViewWrap}>
        <div className={styles.cardphotoToolbarRow}>
          <Toolbar section="cardphotoCreate" />
        </div>
        <div className={styles.cardphotoViewContent}>
          <CardphotoView previewUrl={previewUrl} />
        </div>
      </div>
    </div>
  )
}
