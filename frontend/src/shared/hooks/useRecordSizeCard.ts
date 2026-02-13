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

export const useRecordSizeCard = (ref: React.RefObject<HTMLElement | null>) => {
  const {
    remSize,
    setSizeCard,
    setSizeMiniCard,
    // setScale,
    // setSizeToolbarContour,
  } = useSizeFacade()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const updateSize = () => {
      const width = element.clientWidth
      const height = element.clientHeight
      const resultSizeMiniCard = getSizeMiniCard({ width, height })
      const currentRemSize = remSize ? remSize : 16
      const resultSizeCard = getSizeCard({ width, height }, currentRemSize)
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
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  // return sizeMiniCard
}
