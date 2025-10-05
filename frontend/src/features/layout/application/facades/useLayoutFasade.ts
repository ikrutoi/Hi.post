import { useSizeFacade } from './useSizeFacade'
import { useMemoryFacade } from './useMemoryFacade'
import { useMetaFacade } from './useMetaFacade'
import { useUiFacade } from './useUiFacade'
import { useSectionFacade } from './useSectionFacade'

export const useLayoutFacade = () => {
  const { size, actions: sizeActions } = useSizeFacade()
  const { memory, actions: memoryActions } = useMemoryFacade()
  const { meta, actions: metaActions } = useMetaFacade()
  const { ui, actions: uiActions } = useUiFacade()
  const { section, actions: sectionActions } = useSectionFacade()

  return {
    layout: {
      sizeCard: size.sizeCard,
      sizeMiniCard: size.sizeMiniCard,
      remSize: size.remSize,
      activeSection: section.activeSection,
      sliderLine: meta.sliderLine,
      sliderLetter: meta.sliderLetter,
      sliderLetterPayload: meta.sliderLetterPayload,
      expendMemoryCard: memory.expendMemoryCard,
      lockExpendMemoryCard: memory.lockExpendMemoryCard,
      choiceClip: meta.choiceClip,
      choiceSave: section.choiceSave,
      choiceSection: section.choiceSection,
      maxCardsList: meta.maxCardsList,
      deltaEnd: meta.deltaEnd,
      dateCartCards: meta.dateCartCards,
      lockDateCartCards: meta.lockDateCartCards,
    },
    size,
    memory,
    meta,
    ui,
    section,
    actions: {
      ...sizeActions,
      ...memoryActions,
      ...metaActions,
      ...uiActions,
      ...sectionActions,
    },
  }
}
