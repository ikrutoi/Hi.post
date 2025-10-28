import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  ChoiceSection,
  ChoiceMemorySection,
  ButtonToolbar,
} from '../../domain/types'
import type { CardSectionName } from '@/shared/types'

import {
  selectActiveSection,
  selectSelectedSection,
  selectDeleteSection,
  selectChoiceSection,
  selectChoiceMemorySection,
  selectButtonToolbar,
  selectChoiceSave,
  // getChoiceClip,
} from '../../infrastructure/selectors'
import {
  setActiveSection,
  setSelectedSection,
  setDeleteSection,
  setChoiceSection,
  setChoiceMemorySection,
  setButtonToolbar,
  setChoiceSave,
  // setChoiceClip, //
} from '../../infrastructure/state'

export const useSectionFacade = () => {
  const dispatch = useAppDispatch()

  const activeSection = useAppSelector(selectActiveSection)
  const selectedSection = useAppSelector(selectSelectedSection)
  const deleteSection = useAppSelector(selectDeleteSection)
  const choiceSection = useAppSelector(selectChoiceSection)
  const choiceMemorySection = useAppSelector(selectChoiceMemorySection)
  const buttonToolbar = useAppSelector(selectButtonToolbar)
  const choiceSave = useAppSelector(selectChoiceSave)
  // const choiceClip = useAppSelector(getChoiceClip)

  return {
    section: {
      activeSection,
      selectedSection,
      deleteSection,
      choiceSection,
      choiceMemorySection,
      buttonToolbar,
      choiceSave,
      // choiceClip,
    },
    actions: {
      setActiveSection: (value: CardSectionName | null) =>
        dispatch(setActiveSection(value)),
      setSelectedSection: (value: string | null) =>
        dispatch(setSelectedSection(value)),
      setDeleteSection: (value: string | null) =>
        dispatch(setDeleteSection(value)),
      setChoiceSection: (value: Partial<ChoiceSection>) =>
        dispatch(setChoiceSection(value)),
      setChoiceMemorySection: (value: Partial<ChoiceMemorySection>) =>
        dispatch(setChoiceMemorySection(value)),
      setButtonToolbar: (value: Partial<ButtonToolbar>) =>
        dispatch(setButtonToolbar(value)),
      setChoiceSave: (value: string | null) => dispatch(setChoiceSave(value)),
      // setChoiceClip: (value: string | null) => dispatch(setChoiceClip(value)), // опционально
    },
  }
}
