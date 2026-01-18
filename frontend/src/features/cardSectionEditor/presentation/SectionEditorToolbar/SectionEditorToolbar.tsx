import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useLayoutFacade } from '@layout/application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import { getQualityColor } from '@cardphoto/application/helpers'
import styles from './SectionEditorToolbar.module.scss'

export const SectionEditorToolbar: React.FC = () => {
  const { size } = useLayoutFacade()
  const { sizeCard, remSize, sectionMenuHeight } = size
  // const [liveProgress, setLiveProgress] = useState(0)

  const { state: cardphotoState } = useCardphotoFacade()

  const { state: toolbarCardphotoState } = useToolbarFacade('cardphoto')
  const { state: toolbarCardphoto } = toolbarCardphotoState

  const thumbRef = useRef<HTMLDivElement>(null)

  const reduxProgress =
    cardphotoState.currentConfig?.crop?.meta?.qualityProgress ?? 0

  console.log('SectionEditorToolbar', reduxProgress)

  useEffect(() => {
    const updateVisuals = (progress: number) => {
      console.log('SectionEditorToolbar->>color')

      const color = getQualityColor(progress)
      if (thumbRef.current) {
        thumbRef.current.style.bottom = `${progress}%`
        thumbRef.current.style.backgroundColor = color
      }
      document.documentElement.style.setProperty('--crop-handle-color', color)
    }

    if (toolbarCardphoto.crop === 'active') {
      updateVisuals(reduxProgress)
    }

    const handleUpdate = (e: any) => updateVisuals(e.detail.progress)

    window.addEventListener('crop-quality-change', handleUpdate)
    return () => window.removeEventListener('crop-quality-change', handleUpdate)
  }, [toolbarCardphoto.crop, reduxProgress])

  // useEffect(() => {
  //   const handleUpdate = (e: any) => {
  //     const progress = e.detail.progress
  //     const color = getQualityColor(progress)

  //     if (thumbRef.current) {
  //       thumbRef.current.style.bottom = `${progress}%`
  //       thumbRef.current.style.backgroundColor = color
  //     }
  //     document.documentElement.style.setProperty('--crop-handle-color', color)
  //   }

  //   window.addEventListener('crop-quality-change', handleUpdate)
  //   return () => window.removeEventListener('crop-quality-change', handleUpdate)
  // }, [])

  if (!sizeCard || !remSize) return null

  const height = sizeCard.height + 4 * remSize
  const width = Number(
    (sizeCard.height * sizeCard.aspectRatio + 6 * remSize).toFixed(2),
  )

  return (
    <div
      className={clsx(styles.sectionEditorToolbar)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Toolbar section="sectionEditorMenu" />
      {sectionMenuHeight && toolbarCardphoto.crop === 'active' && (
        <div
          className={clsx(styles.toolbarCropQualityContainer)}
          style={{ height: `${sectionMenuHeight}px` }}
        >
          <div className={styles.toolbarCropQuality}>
            <div
              ref={thumbRef}
              className={styles.qualityThumb}
              // style={{
              //   bottom: `${liveProgress}%`,
              //   backgroundColor: getQualityColor(liveProgress),
              // }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
