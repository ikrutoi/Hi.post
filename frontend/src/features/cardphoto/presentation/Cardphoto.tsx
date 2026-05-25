import React, { useCallback } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { useCardphotoTitleStrip } from '@cardphoto/application/hooks'
import { CARDPHOTO_TEMPLATE_TITLE_MAX_LENGTH } from '@cardphoto/application/helpers/cardphotoTemplateTitle'
import { CardphotoView } from './CardphotoView/CardphotoView'
import { deleteCardphotoFromViewRequested } from '@cardphoto/infrastructure/state'
import { selectCardphotoTitle } from '@cardphoto/infrastructure/selectors'
import { toolbarAction } from '@toolbar/application/helpers'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { IconSectionMenuCardphoto } from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './Cardphoto.module.scss'
import viewStyles from './CardphotoView/CardphotoView.module.scss'
import titleStripStyles from './CardphotoTitleStrip.module.scss'

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
  const title = useAppSelector(selectCardphotoTitle)
  const showAssetToolbar = !!activeImage && !!assetToolbar
  const showTemplateTitleStrip = assetToolbar === 'cardphotoView' && !!activeImage
  const displayTitle = title.trim()

  const {
    titleInputRef,
    titleStripRef,
    draftTitle,
    setDraftTitle,
    isSubmittingTitle,
    forceEditingTitle,
    startEditTitle,
    cancelEditTitle,
    commitEditTitle,
    imageStatus,
  } = useCardphotoTitleStrip({
    title,
    id: activeImage?.id ?? null,
    imageStatus: activeImage?.status,
  })

  const handleDelete = useCallback(() => {
    if (assetToolbar === 'cardphotoCreate') {
      dispatch(
        toolbarAction({ section: 'cardphotoCreate', key: 'delete' } as const),
      )
      return
    }
    dispatch(deleteCardphotoFromViewRequested())
  }, [dispatch, assetToolbar])

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
          {showTemplateTitleStrip &&
            (forceEditingTitle ? (
              <div
                ref={titleStripRef}
                className={clsx(
                  titleStripStyles.viewTitle,
                  titleStripStyles.viewTitleStrip,
                  titleStripStyles.viewTitleEditing,
                )}
              >
                <input
                  ref={titleInputRef}
                  type="text"
                  className={titleStripStyles.viewTitleEditingInput}
                  value={draftTitle}
                  maxLength={CARDPHOTO_TEMPLATE_TITLE_MAX_LENGTH}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onBlur={() => {
                    if (imageStatus === 'inLine') cancelEditTitle()
                    else void commitEditTitle()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault()
                      cancelEditTitle()
                    }
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (imageStatus !== 'inLine') void commitEditTitle()
                    }
                  }}
                  disabled={isSubmittingTitle}
                  aria-label="Template name"
                  title="Edit template name"
                />
                <button
                  type="button"
                  className={titleStripStyles.viewTitleEditingBtn}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => void commitEditTitle()}
                  aria-label="Save and close"
                  title="Save and close"
                  disabled={isSubmittingTitle}
                >
                  {getToolbarIcon({ key: 'applyLight' })}
                </button>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                className={clsx(
                  titleStripStyles.viewTitle,
                  titleStripStyles.viewTitleStrip,
                  titleStripStyles.viewTitleDisplay,
                )}
                onClick={startEditTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    startEditTitle()
                  }
                }}
                aria-label="Edit template name"
                title="Edit template name"
              >
                <span className={titleStripStyles.viewTitleDisplayLabel}>
                  <span className={titleStripStyles.viewTitleText}>
                    {displayTitle}
                  </span>
                </span>
                <span
                  className={titleStripStyles.viewTitleEditingBtn}
                  aria-hidden
                >
                  {getToolbarIcon({ key: 'editLight' })}
                </span>
              </div>
            ))}
          <CardphotoView
            onDelete={handleDelete}
            titleStripEditing={forceEditingTitle}
          />
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
