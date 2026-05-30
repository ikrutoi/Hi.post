import { useLayoutEffect } from 'react'
import {
  getSizeMiniCard,
  getSizeCard,
} from '@shared/utils/layout'
import { useSizeFacade } from '@layout/application/facades'

export interface UseRecordSizeCardOptions {
  skipPanelMeasure?: boolean
  /** When false, skip measuring until layout targets are mounted (e.g. after auth gate). */
  enabled?: boolean
}

export const useRecordSizeCard = (
  formRef: React.RefObject<HTMLElement | null>,
  cardPanelRef: React.RefObject<HTMLElement | null>,
  options?: UseRecordSizeCardOptions,
) => {
  const {
    remSize,
    setSizeCard,
    setSizeMiniCard,
  } = useSizeFacade()
  const skipPanelMeasure = options?.skipPanelMeasure ?? false
  const enabled = options?.enabled ?? true

  useLayoutEffect(() => {
    if (!enabled) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    let rafId = 0

    const attach = (): boolean => {
      const elementForm = formRef.current
      const elementCardPanel = cardPanelRef.current
      if (!elementForm || !elementCardPanel) return false

      const updateSize = () => {
        if (cancelled) return
        const widthForm = elementForm.clientWidth
        const heightForm = elementForm.clientHeight
        if (skipPanelMeasure) {
          const currentRemSize = remSize ?? 16
          const resultSizeCard = getSizeCard(
            { width: widthForm, height: heightForm },
            currentRemSize,
          )
          setSizeCard(resultSizeCard)
          return
        }
        const widthCardPanel = elementCardPanel.clientWidth
        const heightCardPanel = elementCardPanel.clientHeight
        const resultSizeMiniCard = getSizeMiniCard({
          width: widthCardPanel,
          height: heightCardPanel,
        })
        const currentRemSize = remSize ? remSize : 16
        const resultSizeCard = getSizeCard(
          { width: widthForm, height: heightForm },
          currentRemSize,
        )

        setSizeMiniCard(resultSizeMiniCard)
        setSizeCard(resultSizeCard)

        if (!remSize) return
      }

      updateSize()

      resizeObserver = new ResizeObserver(() => updateSize())
      resizeObserver.observe(elementForm)
      resizeObserver.observe(elementCardPanel)
      return true
    }

    let attempts = 0
    const tick = () => {
      if (cancelled) return
      if (attach()) return
      if (++attempts > 60) return
      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      resizeObserver?.disconnect()
    }
  }, [enabled, remSize, skipPanelMeasure, setSizeCard, setSizeMiniCard])
}
