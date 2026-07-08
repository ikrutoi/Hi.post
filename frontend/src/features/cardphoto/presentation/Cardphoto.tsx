import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { useCardphotoTitleStrip } from '@cardphoto/application/hooks'
import { CARDPHOTO_TEMPLATE_TITLE_MAX_LENGTH } from '@cardphoto/application/helpers/cardphotoTemplateTitle'
import { CardphotoView } from './CardphotoView/CardphotoView'
import {
  deleteCardphotoFromViewRequested,
} from '@cardphoto/infrastructure/state'
import {
  selectCardphotoTitle,
} from '@cardphoto/infrastructure/selectors'
import { toolbarAction } from '@toolbar/application/helpers'
import { CARDPHOTO_CREATE_TOOLBAR, CARDPHOTO_VIEW_TOOLBAR } from '@toolbar/domain/types/cardphoto.types'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { MobileInlineToolbarRow } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
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
    <div className={clsx(styles.cardphoto, styles.cardphotoSectionFrame)}>
      <div className={styles.cardphotoViewWrap}>
        <MobileInlineToolbarRow
          className={styles.cardphotoToolbarRow}
          emptyClassName={styles.cardphotoToolbarRowEmpty}
          show={false}
        >
          {null}
        </MobileInlineToolbarRow>
        <div
          className={clsx(
            styles.cardphotoViewContent,
            styles.cardphotoViewContentSectionFrame,
          )}
        >
          <div
            className={clsx(
              viewStyles.viewContainer,
              viewStyles.viewContainerSectionFrame,
            )}
          >
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
  const { isMobileLayout } = useSizeFacade()
  const { activeImage, assetToolbar } = useCardphotoFacade()
  const title = useAppSelector(selectCardphotoTitle)
  const createToolbarState = useAppSelector(
    selectToolbarSectionState('cardphotoCreate'),
  )
  const viewToolbarState = useAppSelector(
    selectToolbarSectionState('cardphotoView'),
  )
  const isCreateCropActive = createToolbarState?.crop?.state === 'active'
  const assetToolbarGroupsOverride = useMemo(() => {
    if (assetToolbar === 'cardphotoCreate' && !isCreateCropActive) {
      return CARDPHOTO_CREATE_TOOLBAR.map((group) =>
        group.group === 'close'
          ? {
              ...group,
              icons: [
                {
                  key: (isMobileLayout ? 'delete' : 'close') as 'delete' | 'close',
                  state: 'enabled' as const,
                },
              ],
            }
          : group,
      )
    }
    if (assetToolbar === 'cardphotoView' && isMobileLayout) {
      return CARDPHOTO_VIEW_TOOLBAR.map((group) =>
        group.group === 'close'
          ? { ...group, icons: [{ key: 'delete' as const, state: 'enabled' as const }] }
          : group,
      )
    }
    return undefined
  }, [assetToolbar, isCreateCropActive, isMobileLayout])
  const assetToolbarStateOverride = useMemo(() => {
    if (assetToolbar === 'cardphotoView' && isMobileLayout && viewToolbarState?.close) {
      return { delete: viewToolbarState.close }
    }
    return undefined
  }, [assetToolbar, isMobileLayout, viewToolbarState])
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
        <MobileInlineToolbarRow
          className={styles.cardphotoToolbarRow}
          emptyClassName={styles.cardphotoToolbarRowEmpty}
          show={showAssetToolbar}
        >
          <Toolbar
            section={assetToolbar!}
            groupsOverride={assetToolbarGroupsOverride}
            stateOverride={assetToolbarStateOverride}
          />
        </MobileInlineToolbarRow>
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
                      void commitEditTitle()
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
    cardPieEditEngaged,
    centerStripListMirrorEnabled,
    rightPieCardphotoPeekNoToolbar,
    listRowInner,
    listRowLocalId,
  } = useRightListArchiveMini()
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()

  if (
    rightPieCardphotoPeekNoToolbar &&
    listRowInner != null &&
    !cardPieEditEngaged
  ) {
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

  /** Правый режим без cardPieEdit: превью архива, без записи в слайс левой открытки. */
  if (
    centerStripListMirrorEnabled &&
    activePieSide === 'right' &&
    !cardPieEditEngaged
  ) {
    return <CardphotoRightListMirror />
  }

  return <CardphotoSessionEditor />
}
