import { useLayoutEffect } from 'react'
import { calcSizeCard } from '@layout/helpers'
import {
  getSizeMiniCard,
  getSizeCard,
  scaleMeasuredHeightToUiScale,
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
      if (!elementForm) return false

      const elementCardPanel = skipPanelMeasure
        ? null
        : cardPanelRef.current
      if (!skipPanelMeasure && !elementCardPanel) return false

      const updateSize = () => {
        if (cancelled) return
        const widthForm = elementForm.clientWidth
        const heightForm = elementForm.clientHeight
        const viewportHeight = window.innerHeight
        if (skipPanelMeasure) {
          const currentRemSize = remSize ?? 16
          const viewportWidth = window.innerWidth
          const formStyle = getComputedStyle(elementForm)
          const paddingTopPx = Number.parseFloat(formStyle.paddingTop) || 0
          const paddingBottomPx = Number.parseFloat(formStyle.paddingBottom) || 0
          let measureWidth = widthForm
          let measureHeight = heightForm

          const parent = elementForm.parentElement
          if (parent) {
            if (measureWidth <= 0) measureWidth = parent.clientWidth
            // Before sizeCard is set the section collapses to form padding only.
            if (measureHeight <= paddingTopPx + paddingBottomPx + 1) {
              measureHeight = parent.clientHeight
            }
          }

          measureHeight = Math.max(
            0,
            measureHeight - paddingTopPx - paddingBottomPx,
          )

          const resultSizeCard =
            measureWidth > 0 && measureHeight > 0
              ? getSizeCard(
                  { width: measureWidth, height: measureHeight },
                  currentRemSize,
                  viewportHeight,
                )
              : calcSizeCard(viewportHeight, 'landscape', viewportWidth)

          if (resultSizeCard.width > 0 && resultSizeCard.height > 0) {
            setSizeCard(resultSizeCard)
          }
          return
        }
        const widthCardPanel = elementCardPanel!.clientWidth
        const heightCardPanel = elementCardPanel!.clientHeight
        const resultSizeMiniCard = getSizeMiniCard({
          width: widthCardPanel,
          height: scaleMeasuredHeightToUiScale(
            heightCardPanel,
            remSize ?? 16,
            viewportHeight,
          ),
        })
        const currentRemSize = remSize ? remSize : 16
        const resultSizeCard = getSizeCard(
          { width: widthForm, height: heightForm },
          currentRemSize,
          viewportHeight,
        )

        setSizeMiniCard(resultSizeMiniCard)
        setSizeCard(resultSizeCard)

        if (!remSize) return
      }

      updateSize()

      resizeObserver = new ResizeObserver(() => updateSize())
      resizeObserver.observe(elementForm)
      if (elementCardPanel) {
        resizeObserver.observe(elementCardPanel)
      } else if (skipPanelMeasure && elementForm.parentElement) {
        resizeObserver.observe(elementForm.parentElement)
      }
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
