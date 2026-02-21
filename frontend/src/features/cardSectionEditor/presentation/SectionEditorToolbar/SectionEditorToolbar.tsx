import React from 'react'
import clsx from 'clsx'
import { useSizeFacade } from '@layout/application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import { PreviewStrip, usePreviewStripItems } from '@features/previewStrip'
import styles from './SectionEditorToolbar.module.scss'
import { CropQualityIndicator } from '@cardSectionToolbar/presentation/CropQualityIndicator'
// import { CropPreview } from '@/features/toolbar/presentation/CropPreview'

export const SectionEditorToolbar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const { sizeCard, remSize, sectionMenuHeight } = useSizeFacade()
  const previewStripItems = usePreviewStripItems(activeSection)

  const { state: toolbarCardphotoState } = useToolbarFacade('cardphoto')
  const { state: toolbarEditorMenuState } =
    useToolbarFacade('sectionEditorMenu')

  if (!sizeCard || !remSize) return null

  const showQualityIndicator =
    sectionMenuHeight &&
    toolbarCardphotoState.crop.state === 'active' &&
    toolbarEditorMenuState.cardphoto === 'active'

  const showPreviewStrip =
    (activeSection === 'cardphoto' &&
      toolbarCardphotoState.crop.state !== 'active') ||
    activeSection === 'cardtext' ||
    activeSection === 'envelope'

  return (
    <div className={styles.sectionEditorToolbar}>
      <Toolbar section="sectionEditorMenu" />

      {(activeSection === 'cardphoto' || activeSection === 'cardtext') && (
        <Toolbar section={activeSection} />
      )}

      <div className={styles.sectionEditorToolbarTop}></div>

      {showQualityIndicator && (
        <div
          className={clsx(
            styles.sectionEditorToolbarRight,
            styles.sectionEditorToolbarRightCropQuality,
          )}
          style={{ height: `${sizeCard.height}px` }}
        >
          <CropQualityIndicator />
        </div>
      )}

      {showPreviewStrip && (
        <div
          className={clsx(
            styles.sectionEditorToolbarRight,
            styles.sectionEditorToolbarRightCropPreview,
          )}
          style={{
            height: `${sizeCard.height}px`,
          }}
        >
          <PreviewStrip
            items={previewStripItems}
            containerHeight={sizeCard.height}
          />
        </div>
      )}

      {/* {activeSection === 'cardphoto' &&
        toolbarCardphotoState.crop.state !== 'active' && (
          <div
            className={clsx(
              styles.sectionEditorToolbarRight,
              styles.sectionEditorToolbarRightCropPreview,
            )}
            style={{
              height: `${sizeCard.height}px`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CropPreview variant="panel" />
          </div>
        )} */}
    </div>
  )
}
