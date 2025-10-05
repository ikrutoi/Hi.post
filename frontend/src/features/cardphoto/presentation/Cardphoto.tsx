import React from 'react'

import { useLayoutFacade } from '@features/layout/application/facades/useLayoutFasade'
import { ImageCrop } from './ImageCrop'
import { Toolbar } from '@toolbar/presentation/Toolbar'

import styles from './Cardphoto.module.scss'

export const Cardphoto = () => {
  const {
    layout: { sizeCard, choiceClip },
  } = useLayoutFacade()

  // const shouldShowToolbar =
  //   choiceClip !== 'cart' &&
  //   choiceClip !== 'minimize' &&
  //   choiceClip !== 'drafts'

  return (
    <div className={styles.cardphoto}>
      {choiceClip && (
        <div className={styles.cardphoto__toolbar}>
          <Toolbar section="cardphoto" />
        </div>
      )}
      <ImageCrop sizeCard={sizeCard} />
    </div>
  )
}
