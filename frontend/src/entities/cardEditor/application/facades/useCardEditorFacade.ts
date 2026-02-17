import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  clearSection,
  resetEditor,
  setHoveredSection,
} from '../../infrastructure/state'
import {
  selectCardEditorState,
  selectCardEditorId,
  selectIsCardEditorCompleted,
  selectHoveredSection,
} from '../../infrastructure/selectors'
import { CARD_SECTIONS } from '@shared/config/constants'
import type { CardSection } from '@shared/config/constants'

export const useCardEditorFacade = () => {
  const dispatch = useAppDispatch()

  const editorState = useAppSelector(selectCardEditorState)
  const editorId = useAppSelector(selectCardEditorId)
  const isCompleted = useAppSelector(selectIsCardEditorCompleted)
  const hoveredSection = useAppSelector(selectHoveredSection)

  const removeSection = (section: CardSection) =>
    dispatch(clearSection(section))
  const reset = () => dispatch(resetEditor())
  const setHovered = (section: CardSection | null) =>
    dispatch(setHoveredSection(section))

  const isSectionHovered = (section: CardSection) => hoveredSection === section

  return {
    editorState,
    editorId,
    isCompleted,
    hoveredSection,
    sections: CARD_SECTIONS,
    removeSection,
    reset,
    setHovered,
    isSectionHovered,
  }
}
