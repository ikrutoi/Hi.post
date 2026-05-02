import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { CardphotoView } from './CardphotoView/CardphotoView'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { IconSectionMenuCardphoto } from '@shared/ui/icons'
import styles from './Cardphoto.module.scss'
import viewStyles from './CardphotoView/CardphotoView.module.scss'

/** Фабрика в режиме правого списка: данные из `mirrorInner`, не из слайса сессии левой открытки. */
const CardphotoRightListMirror: React.FC = () => {
  const { mirrorInner } = useRightListArchiveMini()
  const url = mirrorInner?.cardphoto?.previewUrl
  const hasPhoto = url != null && url !== ''

  return (
    <div className={styles.cardphoto}>
      <div className={styles.cardphotoViewWrap}>
        <div className={styles.cardphotoToolbarRow} />
        <div className={styles.cardphotoViewContent}>
          <div className={viewStyles.viewContainer}>
            <div className={viewStyles.stageRoot}>
              {hasPhoto ? (
                <img
                  key={mirrorInner?.cardphoto?.id ?? url}
                  src={url}
                  alt=""
                  className={styles.mirrorPreview}
                />
              ) : (
                <div className={viewStyles.emptyPlaceholderIcon} aria-hidden>
                  <IconSectionMenuCardphoto />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CardphotoSessionEditor: React.FC = () => {
  const { activeImage, assetToolbar } = useCardphotoFacade()

  return (
    <div className={styles.cardphoto}>
      <div className={styles.cardphotoViewWrap}>
        <div className={styles.cardphotoToolbarRow}>
          {activeImage && assetToolbar ? (
            <Toolbar section={assetToolbar} />
          ) : null}
        </div>
        <div className={styles.cardphotoViewContent}>
          <CardphotoView />
        </div>
      </div>
    </div>
  )
}

export const Cardphoto: React.FC = () => {
  const { centerStripListMirrorEnabled } = useRightListArchiveMini()

  if (centerStripListMirrorEnabled) {
    return <CardphotoRightListMirror />
  }

  return <CardphotoSessionEditor />
}
