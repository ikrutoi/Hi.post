import { useEffect, useState } from 'react'
import {
  getSizeMiniCard,
  getSizeCard,
  // getSizeToolbarContour,
} from '@shared/utils/layout'
// import { useLayoutFacade } from '@layout/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { getMaxMiniCardsCount } from '@shared/utils/layout'
import { roundTo } from '@shared/helpers'
import type { SizeCard } from '@layout/domain/types'

export interface UseRecordSizeCardOptions {
  /** Когда true, размер панели не обновляется (нижний блок сохраняет прежнюю ширину). */
  skipPanelMeasure?: boolean
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
    // setScale,
    // setSizeToolbarContour,
  } = useSizeFacade()
  const skipPanelMeasure = options?.skipPanelMeasure ?? false

  useEffect(() => {
    const elementForm = formRef.current
    const elementCardPanel = cardPanelRef.current
    if (!elementForm || !elementCardPanel) return

    const updateSize = () => {
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
      // const resultSizeToolbarContour = getSizeToolbarContour(
      //   resultSizeCard,
      //   currentRemSize,
      // )
      // const scale = roundTo.nearest(
      //   resultSizeCard.width / resultSizeMiniCard.width,
      // )

      setSizeMiniCard(resultSizeMiniCard)
      setSizeCard(resultSizeCard)
      // setSizeToolbarContour(resultSizeToolbarContour)
      // setScale(scale)

      if (!remSize) return
    }

    updateSize()

    const resizeObserver = new ResizeObserver(() => updateSize())
    resizeObserver.observe(elementForm)

    return () => resizeObserver.disconnect()
  }, [skipPanelMeasure])

  // return sizeMiniCard
}
