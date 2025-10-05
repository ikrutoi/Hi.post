import { AppDispatch } from '@app/state'
import {
  setActiveSection,
  setSelectedSection,
  setDeleteSection,
  setChoiceSection,
  setChoiceMemorySection,
  setButtonToolbar,
  setChoiceSave,
  // setChoiceClip,
} from '../../infrastructure/state/section.slice'
import type { CardSectionName } from '@shared/types'
import type {
  ChoiceSection,
  ChoiceMemorySection,
  ButtonToolbar,
} from '../../domain/types'

export const sectionController = (dispatch: AppDispatch) => ({
  setActiveSection: (section: CardSectionName | null) =>
    dispatch(setActiveSection(section)),
  setSelectedSection: (section: string | null) =>
    dispatch(setSelectedSection(section)),
  setDeleteSection: (section: string | null) =>
    dispatch(setDeleteSection(section)),
  setChoiceSection: (payload: Partial<ChoiceSection>) =>
    dispatch(setChoiceSection(payload)),
  setChoiceMemorySection: (payload: Partial<ChoiceMemorySection>) =>
    dispatch(setChoiceMemorySection(payload)),
  setButtonToolbar: (payload: Partial<ButtonToolbar>) =>
    dispatch(setButtonToolbar(payload)),
  setChoiceSave: (value: string | null) => dispatch(setChoiceSave(value)),
  // setChoiceClip: (value: string | null) => dispatch(setChoiceClip(value)),
})
