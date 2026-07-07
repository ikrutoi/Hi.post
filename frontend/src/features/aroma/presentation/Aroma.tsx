import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { AromaTile } from './AromaTile/AromaTile'
import { AROMA_LIST } from '@entities/aroma/domain/constants'
import { useAromaFacade } from '../application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { MobileInlineToolbarRow } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setCartItemCardAroma } from '@cart/infrastructure/state'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import { AROMA_PREVIEW_NAV_TOOLBAR } from '@toolbar/domain/types/aroma.types'
import { closeAromaPreview } from '@aroma/infrastructure/state'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@layout/infrastructure/selectors'
import styles from './Aroma.module.scss'
import type { AromaItem } from '@entities/aroma/domain/types'

const AromaSectionShell: React.FC<{
  children: React.ReactNode
  showToolbar?: boolean
}> = ({ children, showToolbar = false }) => {
  const { isMobileLayout } = useSizeFacade()
  const aromaPreviewToolbarGroups = isMobileLayout
    ? AROMA_PREVIEW_NAV_TOOLBAR
    : undefined

  return (
    <div className={styles.aroma}>
      <div className={styles.aromaViewWrap}>
        <MobileInlineToolbarRow
          className={styles.aromaToolbarRow}
          show={showToolbar}
        >
          <Toolbar
            section="aroma"
            groupsOverride={aromaPreviewToolbarGroups}
          />
        </MobileInlineToolbarRow>
        <div className={styles.aromaViewContent}>{children}</div>
      </div>
    </div>
  )
}

export const Aroma: React.FC = () => {
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()
  const dispatch = useAppDispatch()
  const activeSection = useAppSelector(selectActiveSection)
  const {
    selectedAroma,
    previewOpen,
    previewIndex,
    openPreview,
  } = useAromaFacade()
  const {
    centerStripListMirrorEnabled,
    mirrorInner,
    mirrorTargetLocalId,
    rightPieAromaPeekNoToolbar,
    listRowInner,
    listRowLocalId,
  } = useRightListArchiveMini()

  useEffect(() => {
    if (activeSection !== 'aroma') {
      dispatch(closeAromaPreview())
    }
  }, [activeSection, dispatch])

  /** In right list mode, highlight the tile that matches the open postcard on the right CardPie. */
  const tileHighlightAroma =
    centerStripListMirrorEnabled && mirrorInner != null
      ? mirrorInner.aroma
      : selectedAroma

  const handleClickAroma = (aromaItem: AromaItem) => {
    if (centerStripListMirrorEnabled) {
      if (mirrorTargetLocalId != null) {
        dispatch(
          setCartItemCardAroma({
            localId: mirrorTargetLocalId,
            aroma: aromaItem,
          }),
        )
      }
      return
    }
    openPreview(aromaItem.index)
  }

  if (rightPieAromaPeekNoToolbar) {
    const rowAroma = listRowInner?.aroma ?? null
    const peekSrc =
      rowAroma != null ? getAromaImage(rowAroma.index) : null
    const peek = (
      <AromaSectionShell
        key={
          listRowLocalId != null ? `peek-aroma-${listRowLocalId}` : 'peek-aroma'
        }
      >
        <div className={clsx(styles.form, styles.formPeek)}>
          {peekSrc ? (
            <img
              className={styles.peekMask}
              src={peekSrc}
              alt={
                rowAroma?.index === 0
                  ? ''
                  : `Aroma slot ${rowAroma?.index ?? ''}`
              }
              draggable={false}
            />
          ) : null}
        </div>
      </AromaSectionShell>
    )
    return notebookTabsOuter ? peek : <NotebookPeekShell>{peek}</NotebookPeekShell>
  }

  const previewSrc =
    previewOpen && previewIndex != null
      ? getAromaImage(previewIndex)
      : null

  return (
    <AromaSectionShell showToolbar={previewOpen}>
      {previewOpen && previewSrc ? (
        <div className={clsx(styles.form, styles.formPeek)}>
          <img
            className={styles.peekMask}
            src={previewSrc}
            alt={
              previewIndex === 0 ? '' : `Aroma slot ${previewIndex ?? ''}`
            }
            draggable={false}
          />
        </div>
      ) : (
        <div className={styles.form}>
          {AROMA_LIST.map((el, i) => (
            <AromaTile
              key={`aroma-${el.index}-${i}`}
              selectedAroma={tileHighlightAroma}
              aromaItem={el}
              onSelectAroma={handleClickAroma}
            />
          ))}
        </div>
      )}
    </AromaSectionShell>
  )
}
