import { useAppDispatch, useAppSelector } from '@app/hooks'
import { clearSection, resetEditor } from '../../infrastructure/state'
import {
  selectCardEditorState,
  selectCardEditorId,
  selectIsCardEditorCompleted,
} from '../../infrastructure/selectors'
import type { CardSection } from '@shared/config/constants'

export const useCardEditorController = () => {
  const dispatch = useAppDispatch()

  const editorState = useAppSelector(selectCardEditorState)
  const editorId = useAppSelector(selectCardEditorId)
  const isCompleted = useAppSelector(selectIsCardEditorCompleted)

  const removeSection = (section: CardSection) => {
    dispatch(clearSection(section))
  }

  const reset = () => {
    dispatch(resetEditor())
  }

  return {
    state: {
      editorState,
      editorId,
      isCompleted,
    },
    actions: {
      removeSection,
      reset,
    },
  }
}
