import React from 'react'
import clsx from 'clsx'
import { useSizeFacade } from '@layout/application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import styles from './SectionEditorToolbar.module.scss'
import { CropQualityIndicator } from '@cardSectionToolbar/presentation/CropQualityIndicator'
// import { CropPreview } from '@/features/toolbar/presentation/CropPreview'

export const SectionEditorToolbar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const { sizeCard, remSize, sectionMenuHeight } = useSizeFacade()
  const { state: toolbarCardphotoState } = useToolbarFacade('cardphoto')
  const { state: toolbarEditorMenuState } =
    useToolbarFacade('sectionEditorMenu')

  if (!sizeCard || !remSize) return null

  const showQualityIndicator =
    sectionMenuHeight &&
    toolbarCardphotoState.crop.state === 'active' &&
    toolbarEditorMenuState.cardphoto === 'active'

  return (
    <div className={styles.sectionEditorToolbar}>
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
