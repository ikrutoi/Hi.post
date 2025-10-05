import { useEffect } from 'react'

import { SECTIONS } from '@/features/cardPanel/domain/constants'

import type { RootState } from '@app/state'
import type { CardPanelSections } from '@/features/cardPanel/domain/types'

interface UseCardPanelSectionsProps {
  selectorLayoutActiveSections: RootState['layout']['activeSections']
  listActiveSections: { section: string; position: number; index: number }[]
  setListActiveSections: React.Dispatch<
    React.SetStateAction<{ section: string; position: number; index: number }[]>
  >
  fullCard: boolean
  setFullCardState: React.Dispatch<React.SetStateAction<boolean>>
  miniPolyCardsRef: React.RefObject<HTMLDivElement | null>
  btnArrowsRef: React.RefObject<HTMLElement | null>
}

export const useCardPanelSections = ({
  selectorLayoutActiveSections,
  listActiveSections,
  setListActiveSections,
  fullCard,
  setFullCardState,
  miniPolyCardsRef,
  btnArrowsRef,
}: UseCardPanelSectionsProps): CardPanelSections => {
  useEffect(() => {
    const baseSections = {
      cardphoto: { section: 'cardphoto', position: 0, index: 4 },
      cardtext: { section: 'cardtext', position: 1, index: 3 },
      envelope: { section: 'envelope', position: 2, index: 2 },
      date: { section: 'date', position: 3, index: 1 },
      aroma: { section: 'aroma', position: 4, index: 0 },
    }

    const active = SECTIONS.filter(
      (key) => selectorLayoutActiveSections[key]
    ).map((key) => baseSections[key])

    const sorted = active.sort((a, b) => a.position - b.position)
    setListActiveSections(sorted)
  }, [selectorLayoutActiveSections])

  useEffect(() => {
    const isFull = listActiveSections.length === 5
    if (fullCard !== isFull) {
      setFullCardState(isFull)
    }

    if (miniPolyCardsRef.current) {
      miniPolyCardsRef.current.classList.toggle('full', isFull)
      miniPolyCardsRef.current.classList.toggle('full-fade-out', !isFull)
    }
  }, [listActiveSections])

  const choiceClassListContainsFullArrows = () => {
    setTimeout(() => {
      btnArrowsRef.current?.classList.add('full')
    }, 0)
  }

  return {
    choiceClassListContainsFullArrows,
  }
}
