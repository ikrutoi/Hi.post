import { useMemo } from 'react'
import { SectionPreset } from '../../domain/types'
import { useLayoutControllers } from '@/features/layout/application/hooks'

export const useSectionPresetsPositioning = (
  sectionPreset: SectionPreset[],
  sizeMiniCard: { width: number; height: number },
  activeIndex: number
) => {
  const { setDeltaEnd, getMaxCardsList } = useLayoutControllers()
  const maxCardsList = getMaxCardsList()

  const baseLeft = sizeMiniCard.width + 8

  const positions = useMemo(() => {
    const result: number[] = []
    const restEnd = sectionPreset.length - activeIndex - maxCardsList

    for (let i = 0; i < sectionPreset.length; i++) {
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
  }, [sectionPreset, activeIndex, maxCardsList, baseLeft])

  return { positions }
}
