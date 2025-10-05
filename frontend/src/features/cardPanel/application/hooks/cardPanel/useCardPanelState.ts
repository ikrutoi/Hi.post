import { useState, useEffect, useRef } from 'react'

import { useLayoutFacade } from '@layout/application/facades'
import type { CardPanelState } from '@/features/cardPanel/domain/types'

export const useCardPanelState = (): CardPanelState => {
  const {
    layout: {
      activeSection,
      expendMemoryCard,
      lockExpendMemoryCard,
      choiceClip,
      maxCardsList,
      choiceSave,
      sizeMiniCard,
      choiceSection,
    },
  } = useLayoutFacade()

  const [buttonsFullCard, setButtonsFullCard] = useState({
    fullCard: { addCart: true, save: true, remove: true },
  })

  const [memoryCardtext, setMemoryCardtext] = useState({ cardtext: null })
  const [minimize, setMinimize] = useState(false)
  const [showIconsMinimize, setShowIconsMinimize] = useState(false)
  const [fullCard, setFullCardState] = useState(false)
  const [listActiveSections, setListActiveSections] = useState<
    { section: string; position: number; index: number }[]
  >([])

  const buttonIconRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const btnArrowsRef = useRef<HTMLElement | null>(null)
  const miniPolyCardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIconsMinimize(minimize)
    }, 700)
    return () => clearTimeout(timer)
  }, [minimize])

  useEffect(() => {
    if (minimize && showIconsMinimize) {
      const buttonsIcon = buttonIconRefs.current
      Object.values(buttonsIcon).forEach((button) => {
        button?.classList.add('minimized')
      })
    }
  }, [minimize, showIconsMinimize])

  return {
    // selectorCardEdit,
    activeSection,
    expendMemoryCard,
    lockExpendMemoryCard,
    choiceSave,
    choiceClip,
    maxCardsList,
    sizeMiniCard,
    choiceSection,
    // selectorInfoEnvelopeSave,
    buttonsFullCard,
    setButtonsFullCard,
    memoryCardtext,
    setMemoryCardtext,
    minimize,
    setMinimize,
    showIconsMinimize,
    setShowIconsMinimize,
    fullCard,
    setFullCardState,
    listActiveSections,
    setListActiveSections,
    buttonIconRefs,
    btnArrowsRef,
    miniPolyCardsRef,
  }
}
