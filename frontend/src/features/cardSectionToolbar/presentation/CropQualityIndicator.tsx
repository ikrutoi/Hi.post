import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { getQualityColor } from '@cardphoto/application/helpers'
import { useAppSelector } from '@app/hooks'
import { selectCropQualityProgress } from '@cardphoto/infrastructure/selectors'
import styles from './CropQualityIndicator.module.scss'

export const CropQualityIndicator: React.FC = () => {
  const thumbRef = useRef<HTMLDivElement>(null)
  const reduxProgress = useAppSelector(selectCropQualityProgress)

  useEffect(() => {
    const updateVisuals = (progress: number) => {
      const color = getQualityColor(progress)
      if (thumbRef.current) {
        thumbRef.current.style.bottom = `${progress}%`
        thumbRef.current.style.backgroundColor = color
      }
      document.documentElement.style.setProperty('--crop-handle-color', color)
    }

    updateVisuals(reduxProgress)

    const handleUpdate = (e: any) => updateVisuals(e.detail.progress)
    window.addEventListener('crop-quality-change', handleUpdate)
    return () => window.removeEventListener('crop-quality-change', handleUpdate)
  }, [reduxProgress])

  return (
    <div
      className={clsx(styles.toolbarCropQualityContainer)}
      // style={{ height: `${height}px` }}
    >
      <div className={styles.toolbarCropQuality}>
        <div ref={thumbRef} className={styles.qualityThumb} />
      </div>
    </div>
  )
}
