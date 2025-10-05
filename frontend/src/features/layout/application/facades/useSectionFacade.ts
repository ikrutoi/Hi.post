import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  ChoiceSection,
  ChoiceMemorySection,
  ButtonToolbar,
} from '../../domain/types'
import type { CardSectionName } from '@/shared/types'

import {
  getActiveSection,
  getSelectedSection,
  getDeleteSection,
  getChoiceSection,
  getChoiceMemorySection,
  getButtonToolbar,
  getChoiceSave,
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

  const activeSection = useAppSelector(getActiveSection)
  const selectedSection = useAppSelector(getSelectedSection)
  const deleteSection = useAppSelector(getDeleteSection)
  const choiceSection = useAppSelector(getChoiceSection)
  const choiceMemorySection = useAppSelector(getChoiceMemorySection)
  const buttonToolbar = useAppSelector(getButtonToolbar)
  const choiceSave = useAppSelector(getChoiceSave)
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
