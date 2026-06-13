import { useLayoutEffect } from 'react'
import {
  calcSizeCard,
  measureMobileEditorSlot,
} from '@layout/helpers'
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
          const { contentWidth, contentHeight, slotHeight } =
            measureMobileEditorSlot(
              elementForm,
              currentRemSize,
              viewportHeight,
            )

          let measureWidth = contentWidth > 0 ? contentWidth : widthForm
          let measureHeight = contentHeight

          if (measureHeight <= 0 && slotHeight > 0) {
            measureHeight = Math.max(
              0,
              slotHeight * 0.72,
            )
          }

          let resultSizeCard =
            measureWidth > 0 && measureHeight > 0
              ? getSizeCard(
                  { width: measureWidth, height: measureHeight },
                  currentRemSize,
                  viewportHeight,
                )
              : calcSizeCard(
                  Math.max(measureHeight, viewportHeight * 0.35),
                  'landscape',
                  viewportWidth,
                )

          if (resultSizeCard.width <= 0 || resultSizeCard.height <= 0) {
            const fallbackHeight = Math.max(
              measureHeight,
              slotHeight * 0.72,
              viewportHeight * 0.28,
              120,
            )
            resultSizeCard = getSizeCard(
              {
                width: Math.max(measureWidth, viewportWidth * 0.85),
                height: fallbackHeight,
              },
              currentRemSize,
              viewportHeight,
            )
          }

          if (resultSizeCard.width <= 0 || resultSizeCard.height <= 0) {
            resultSizeCard = calcSizeCard(
              Math.max(measureHeight, viewportHeight * 0.35),
              'landscape',
              viewportWidth,
            )
          }

          if (contentHeight > 0 && resultSizeCard.height > contentHeight) {
            const capped = getSizeCard(
              { width: measureWidth, height: contentHeight },
              currentRemSize,
              viewportHeight,
            )
            if (capped.width > 0 && capped.height > 0) {
              resultSizeCard = capped
            }
          }

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
        const mobileBody = elementForm.parentElement?.parentElement
        if (mobileBody) {
          resizeObserver.observe(mobileBody)
        }
      }
      return true
    }

    let attempts = 0
    const tick = () => {
      if (cancelled) return
      if (attach()) return
      if (++attempts > 120) return
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
