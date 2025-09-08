import { useLayoutFacade } from '@features/layout/application/facades/useLayoutFacade1'

export const useCardphotoBtnFacade = () => {
  const { size, section, meta } = useLayoutFacade()

  return {
    sizeCard: size.sizeCard,
    setSizeCard: size.setSizeCard,

    choiceSection: section.choice,
    setChoiceSection: section.setChoice,

    choiceClip: meta.choiceClip,
    setChoiceClip: meta.setChoiceClip,
  }
}
