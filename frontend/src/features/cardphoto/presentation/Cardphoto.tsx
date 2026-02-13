import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { ImageCrop } from './ImageCrop'
import styles from './Cardphoto.module.scss'

export const Cardphoto = () => {
  return (
    <div className={styles.cardphoto}>
      {/* <div className={styles.cardphotoToolbar}>
        <Toolbar section="cardphoto" />
      </div> */}
      <ImageCrop />
    </div>
  )
}
