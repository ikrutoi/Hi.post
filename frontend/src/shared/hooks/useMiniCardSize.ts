import { useEffect, useState } from 'react'
import { getSizeMiniCard, getSizeCard } from '@shared/utils/layout'
import { useLayoutFacade } from '@layout/application/facades'
import { getMaxMiniCardsCount } from '@shared/utils/layout'
import { roundTo } from '@shared/helpers'
import type { SizeCard } from '@layout/domain/types'

export const useMiniCardSize = (ref: React.RefObject<HTMLElement | null>) => {
  const [sizeMiniCard, setSizeMiniCard] = useState<SizeCard | null>(null)
  const { size, actions: actionsSize } = useLayoutFacade()
  const { remSize } = size
  const {
    setSizeCard: updateSizeCard,
    setSizeMiniCard: updateSizeMiniCard,
    setScale: updateScale,
    setMaxMiniCardsCount,
  } = actionsSize

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const updateSize = () => {
      const width = element.clientWidth
      const height = element.clientHeight
      const resultSizeMiniCard = getSizeMiniCard({ width, height })
      const resultSizeCard = getSizeCard({ width, height }, resultSizeMiniCard)
      const scale = roundTo.nearest(
        resultSizeCard.width / resultSizeMiniCard.width
      )

      setSizeMiniCard(resultSizeMiniCard)
      updateSizeMiniCard(resultSizeMiniCard)
      updateSizeCard(resultSizeCard)
      updateScale(scale)

      if (!remSize) return

      const maxMiniCardsCount = getMaxMiniCardsCount(
        width,
        resultSizeMiniCard,
        remSize
      )

      if (!maxMiniCardsCount) return

      setMaxMiniCardsCount(maxMiniCardsCount)
    }

    updateSize()

    const resizeObserver = new ResizeObserver(() => updateSize())
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  // return sizeMiniCard
}
