import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useLayoutFacade } from '@layout/application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import { getQualityColor } from '@cardphoto/application/helpers'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import styles from './SectionEditorToolbar.module.scss'

export const SectionEditorToolbar: React.FC = () => {
  const { state: sectionMenuState } = useSectionMenuFacade()
  const { isHydrated } = sectionMenuState

  const { size } = useLayoutFacade()
  const { sizeCard, remSize, sectionMenuHeight } = size
  const { state: cardphotoState } = useCardphotoFacade()
  const { state: toolbarCardphotoState } = useToolbarFacade('cardphoto')
  const { state: toolbarCardphoto } = toolbarCardphotoState
  const { state: toolbarSectionEditorMenuState } =
    useToolbarFacade('sectionEditorMenu')
  const sectionMenuCardphoto = toolbarSectionEditorMenuState.state.cardphoto

  const thumbRef = useRef<HTMLDivElement>(null)

  const reduxProgress =
    cardphotoState.currentConfig?.crop?.meta?.qualityProgress ?? 0

  useEffect(() => {
    const updateVisuals = (progress: number) => {
      const color = getQualityColor(progress)
      if (thumbRef.current) {
        thumbRef.current.style.bottom = `${progress}%`
        thumbRef.current.style.backgroundColor = color
      }
      document.documentElement.style.setProperty('--crop-handle-color', color)
    }

    if (toolbarCardphoto.crop.state === 'active') {
      updateVisuals(reduxProgress)
    }

    const handleUpdate = (e: any) => updateVisuals(e.detail.progress)

    window.addEventListener('crop-quality-change', handleUpdate)
    return () => window.removeEventListener('crop-quality-change', handleUpdate)
  }, [toolbarCardphoto.crop, reduxProgress, sectionMenuCardphoto])

  if (!sizeCard || !remSize) return null

  const height = sizeCard.height + 4 * remSize
  const width = Number(
    (sizeCard.height * CARD_SCALE_CONFIG.aspectRatio + 6 * remSize).toFixed(2),
  )

  return (
    <div
      className={clsx(styles.sectionEditorToolbar)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {isHydrated && <Toolbar section="sectionEditorMenu" />}
      {sectionMenuHeight &&
        toolbarCardphoto.crop.state === 'active' &&
        sectionMenuCardphoto === 'active' && (
          <div
            className={clsx(styles.toolbarCropQualityContainer)}
            style={{ height: `${sectionMenuHeight}px` }}
          >
            <div className={styles.toolbarCropQuality}>
              <div ref={thumbRef} className={styles.qualityThumb} />
            </div>
          </div>
        )}
    </div>
  )
}
