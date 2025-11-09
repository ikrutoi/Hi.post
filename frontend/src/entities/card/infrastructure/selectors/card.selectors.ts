import type { RootState } from '@app/state'
import { CARD_SECTIONS } from '../../domain/types'
import type { CardEditor, CardSection } from '../../domain/types'

export const selectCardEditor = (state: RootState): CardEditor =>
  state.cardEditor

export const selectCardEditorSection = <T extends CardSection>(
  state: RootState,
  section: T
): CardEditor[T] => state.cardEditor[section]

export const selectCardEditorId = (state: RootState): string | null =>
  state.cardEditor.id

export const selectHasAnySectionCompleteCardEditor = (
  state: RootState
): boolean => {
  const card = state.cardEditor
  return CARD_SECTIONS.some((section) => card[section].isComplete)
}

export const selectIsCardEditorComplete = (state: RootState): boolean => {
  const card = selectCardEditor(state)
  return CARD_SECTIONS.every((section) => card[section].isComplete)
}

export const selectCompletedSectionsCardEditor = (
  state: RootState
): CardSection[] => {
  const card = state.cardEditor
  return CARD_SECTIONS.filter((section) => card[section].isComplete)
}

export const selectCompletionCardEditorMap = (
  state: RootState
): Record<CardSection, boolean> => {
  const card = state.cardEditor
  return CARD_SECTIONS.reduce(
    (acc, section) => {
      acc[section] = card[section].isComplete
      return acc
    },
    {} as Record<CardSection, boolean>
  )
}

export const selectIncompleteSectionsCardEditor = (
  state: RootState
): CardSection[] => {
  const card = selectCardEditor(state)
  return CARD_SECTIONS.filter((section) => !card[section].isComplete)
}
