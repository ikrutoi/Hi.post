import { useEffect, useState } from 'react'
import { selectCropQualityProgress } from '@cardphoto/infrastructure/selectors'
import { getQualityColor } from '@cardphoto/application/helpers'
import { useAppSelector } from '@app/hooks'

function clampProgress(progress: number): number {
  return Math.max(0, Math.min(100, progress))
}

/** Same 0–100 reading as the crop quality meter, including live drag updates. */
export function useCropQualityFill(disabled: boolean): {
  progress: number
  color: string | undefined
} {
  const reduxProgress = useAppSelector(selectCropQualityProgress)
  const [liveProgress, setLiveProgress] = useState<number | null>(null)

  useEffect(() => {
    if (disabled) return
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ progress: number }>
      if (typeof ce.detail?.progress === 'number') {
        setLiveProgress(ce.detail.progress)
      }
    }
    window.addEventListener('crop-quality-change', handler)
    return () => window.removeEventListener('crop-quality-change', handler)
  }, [disabled])

  useEffect(() => {
    setLiveProgress(null)
  }, [reduxProgress])

  const progress = clampProgress(liveProgress ?? reduxProgress)
  return {
    progress: disabled ? 0 : progress,
    color: disabled ? undefined : getQualityColor(progress),
  }
}
