import React from 'react'
import styles from './Cardphoto.module.scss'

import { useLayoutFacade } from '@features/layout/application/facades/useLayoutFacade1'
import { ImageCrop } from './ImageCrop'
import { Toolbar } from '@features/cardphoto/toolbar/presentation/Toolbar.view'

export const Cardphoto = () => {
  const {
    size: { sizeCard },
    meta: { choiceClip },
  } = useLayoutFacade()

  const shouldShowToolbar =
    choiceClip !== 'cart' &&
    choiceClip !== 'minimize' &&
    choiceClip !== 'drafts'

  return (
    <div className={styles.cardphoto}>
      {shouldShowToolbar && (
        <div className={styles.cardphoto__toolbar}>
          <Toolbar />
        </div>
      )}
      <ImageCrop sizeCard={sizeCard} />
    </div>
  )
}
