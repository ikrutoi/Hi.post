import { useState, useEffect, useRef } from 'react'
import { useLayoutFacade } from '@layout/application/facades'
import type { CardPanelState } from '@/features/cardPanel/domain/types'

export const useCardPanelState = (): CardPanelState => {
  const { section, size, meta, ui, memory } = useLayoutFacade()
  const { activeSection, choiceSection, choiceSave } = section
  const { sizeMiniCard } = size
  const { maxCardsList } = meta
  const { expendMemoryCard, lockExpendMemoryCard } = memory
  const { selectedTemplate } = ui

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
  const buttonArrowsRef = useRef<HTMLButtonElement | null>(null)
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
    activeSection,
    expendMemoryCard,
    lockExpendMemoryCard,
    choiceSave,
    selectedTemplate,
    maxCardsList,
    sizeMiniCard,
    choiceSection,
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
    buttonArrowsRef,
    miniPolyCardsRef,
  }
}
