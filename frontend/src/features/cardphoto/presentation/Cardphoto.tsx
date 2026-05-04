import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { CardphotoView } from './CardphotoView/CardphotoView'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { IconSectionMenuCardphoto } from '@shared/ui/icons'
import styles from './Cardphoto.module.scss'
import viewStyles from './CardphotoView/CardphotoView.module.scss'

import type { CardPieInnerData } from '@features/cardPie/infrastructure/postcardCardPieViewModel'

const CardphotoInnerPreviewOnly: React.FC<{
  inner: CardPieInnerData | null
}> = ({ inner }) => {
  const url =
    inner?.cardphoto?.factoryDisplayUrl ?? inner?.cardphoto?.previewUrl ?? null
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
                  key={inner?.cardphoto?.id ?? url}
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

/** Фабрика в режиме правого списка: данные из `mirrorInner`, не из слайса сессии левой открытки. */
const CardphotoRightListMirror: React.FC = () => {
  const { mirrorInner } = useRightListArchiveMini()
  return <CardphotoInnerPreviewOnly inner={mirrorInner} />
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
  const {
    activePieSide,
    centerStripListMirrorEnabled,
    rightPieCardphotoPeekNoToolbar,
    listRowInner,
  } = useRightListArchiveMini()

  /** Зеркало в фабрике только при активном правом пироге; при cardPieCopy (левый пирог) — полный редактор сессии. */
  if (centerStripListMirrorEnabled && activePieSide === 'right') {
    return <CardphotoRightListMirror />
  }

  if (rightPieCardphotoPeekNoToolbar && listRowInner != null) {
    return (
      <NotebookPeekShell>
        <CardphotoInnerPreviewOnly inner={listRowInner} />
      </NotebookPeekShell>
    )
  }

  return <CardphotoSessionEditor />
}
