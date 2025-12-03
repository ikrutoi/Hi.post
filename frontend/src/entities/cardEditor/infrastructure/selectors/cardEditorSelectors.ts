import { RootState } from '@app/state'
import type { CardSection } from '@shared/config/constants'
import type { CardEditorState } from '../../domain/types'

export const selectCardEditorState = (state: RootState): CardEditorState =>
  state.cardEditor

export const selectCardEditorId = (state: RootState): string =>
  state.cardEditor.id

export const selectIsCardEditorCompleted = (state: RootState): boolean =>
  state.cardEditor.isCompleted

export const selectSectionComplete = (
  state: RootState,
  section: CardSection
): boolean => state.cardEditor[section].isComplete
