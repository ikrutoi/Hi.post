import { useEffect } from 'react'
import { CARD_SECTIONS } from '@entities/card/domain/types'
import type { CardSection } from '@entities/card/domain/types'
// import type { CardPanelSections } from '@cardPanel/domain/types'

interface UseCardPanelSectionsProps {
  activeSection: Record<CardSection, boolean>
  listActiveSections: { section: string; position: number; index: number }[]
  setListActiveSections: React.Dispatch<
    React.SetStateAction<{ section: string; position: number; index: number }[]>
  >
  fullCard: boolean
  setFullCardState: React.Dispatch<React.SetStateAction<boolean>>
  miniPolyCardsRef: React.RefObject<HTMLDivElement | null>
  buttonArrowsRef: React.RefObject<HTMLElement | null>
}

export const useCardPanelSections = ({
  activeSection,
  listActiveSections,
  setListActiveSections,
  fullCard,
  setFullCardState,
  miniPolyCardsRef,
  buttonArrowsRef,
}: UseCardPanelSectionsProps): void => {
  useEffect(() => {
    const baseSections: Record<
      CardSection,
      { section: CardSection; position: number; index: number }
    > = {
      cardphoto: { section: 'cardphoto', position: 0, index: 4 },
      cardtext: { section: 'cardtext', position: 1, index: 3 },
      envelope: { section: 'envelope', position: 2, index: 2 },
      aroma: { section: 'aroma', position: 3, index: 1 },
      date: { section: 'date', position: 4, index: 0 },
    }

    const active = CARD_SECTIONS.filter(
      (key: CardSection) => activeSection[key]
    ).map((key: CardSection) => baseSections[key])

    const sorted = active.sort((a, b) => a.position - b.position)
    setListActiveSections(sorted)
  }, [activeSection])

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
      buttonArrowsRef.current?.classList.add('full')
    }, 0)
  }

  // return {
  //   choiceClassListContainsFullArrows,
  // }
}
