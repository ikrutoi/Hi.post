import React, { useCallback } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppDispatch } from '@app/hooks'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { CardphotoView } from './CardphotoView/CardphotoView'
import { deleteCardphotoFromViewRequested } from '@cardphoto/infrastructure/state'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
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
  const { mirrorInner, mirrorTargetLocalId } = useRightListArchiveMini()
  return (
    <CardphotoInnerPreviewOnly
      key={
        mirrorTargetLocalId != null
          ? `mirror-row-${mirrorTargetLocalId}`
          : 'mirror-row'
      }
      inner={mirrorInner}
    />
  )
}

const CardphotoSessionEditor: React.FC = () => {
  const dispatch = useAppDispatch()
  const { activeImage, assetToolbar } = useCardphotoFacade()
  const showAssetToolbar = !!activeImage && !!assetToolbar

  const handleViewDelete = useCallback(() => {
    dispatch(deleteCardphotoFromViewRequested())
  }, [dispatch])

  return (
    <div className={styles.cardphoto}>
      <div className={styles.cardphotoViewWrap}>
        <div
          className={clsx(
            styles.cardphotoToolbarRow,
            !showAssetToolbar && styles.cardphotoToolbarRowEmpty,
          )}
          aria-hidden={showAssetToolbar ? undefined : true}
        >
          {showAssetToolbar ? (
            <Toolbar section={assetToolbar} />
          ) : null}
        </div>
        <div className={styles.cardphotoViewContent}>
          <CardphotoView onDelete={handleViewDelete} />
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
    listRowLocalId,
  } = useRightListArchiveMini()
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()

  /** Зеркало в фабрике только при активном правом пироге; при cardPieCopy (левый пирог) — полный редактор сессии. */
  if (centerStripListMirrorEnabled && activePieSide === 'right') {
    return <CardphotoRightListMirror />
  }

  if (rightPieCardphotoPeekNoToolbar && listRowInner != null) {
    const peek = (
      <CardphotoInnerPreviewOnly
        key={
          listRowLocalId != null ? `peek-row-${listRowLocalId}` : 'peek-row'
        }
        inner={listRowInner}
      />
    )
    return notebookTabsOuter ? peek : <NotebookPeekShell>{peek}</NotebookPeekShell>
  }

  return <CardphotoSessionEditor />
}
