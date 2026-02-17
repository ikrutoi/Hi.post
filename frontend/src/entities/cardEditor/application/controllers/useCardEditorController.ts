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
  selectIsSectionHovered,
} from '../../infrastructure/selectors'
import type { CardSection } from '@shared/config/constants'

export const useCardEditorController = () => {
  const dispatch = useAppDispatch()

  const editorState = useAppSelector(selectCardEditorState)
  const editorId = useAppSelector(selectCardEditorId)
  const isCompleted = useAppSelector(selectIsCardEditorCompleted)
  const hoveredSection = useAppSelector(selectHoveredSection)

  const removeSection = (section: CardSection) => {
    dispatch(clearSection(section))
  }

  const reset = () => {
    dispatch(resetEditor())
  }

  const setHovered = (section: CardSection | null) => {
    dispatch(setHoveredSection(section))
  }

  const isSectionActive = (section: CardSection) => hoveredSection === section

  return {
    editorState,
    editorId,
    isCompleted,
    hoveredSection,
    isSectionActive,
    setHovered,
    removeSection,
    reset,
  }
}
