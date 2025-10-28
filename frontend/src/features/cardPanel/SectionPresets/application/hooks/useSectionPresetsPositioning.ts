import { useMemo } from 'react'
import { useLayoutFacade } from '@layout/application/facades'
import type { CartItem } from '@entities/cart/domain/types'
import type { PresetLetterItem } from '../../domain/types'

export const useSectionPresetsPositioning = (
  cart: CartItem[],
  sizeMiniCard: { width: number; height: number },
  letterIndexList: PresetLetterItem[]
) => {
  const { meta, actions } = useLayoutFacade()
  const { maxCardsList } = meta
  // const {sizeMiniCard} = size
  const { setDeltaEnd } = actions

  if (!maxCardsList) return

  const baseLeft = sizeMiniCard.width + 8
  const positions = useMemo(() => {
    const result: number[] = []
    const restEnd = cart.length - activeIndex - maxCardsList

    for (let i = 0; i < cart.length; i++) {
      const left =
        i < activeIndex
          ? 0
          : i < activeIndex + maxCardsList
            ? baseLeft * (i - activeIndex)
            : baseLeft * (maxCardsList - 1)
      result.push(left)
    }

    setDeltaEnd(restEnd <= 0 ? 1 : 0)
    return result
  }, [cart, activeIndex, maxCardsList, baseLeft])

  return { positions }
}
