import type { RootState } from '@app/state'
import { CARD_SECTIONS } from '@entities/card/domain/types'
import type { CardSection, Card, CardStatus } from '@entities/card/domain/types'

export const selectCardEditor = (state: RootState): Card => state.cardEditor

export const selectEditorSection = (state: RootState, section: CardSection) =>
  state.cardEditor[section]

export const selectIsEditorSectionComplete = (
  state: RootState,
  section: CardSection
): boolean => state.cardEditor[section].isComplete

export const selectIncompleteEditorSections = (
  state: RootState
): CardSection[] =>
  CARD_SECTIONS.filter((section) => !state.cardEditor[section].isComplete)

export const selectEditorProgress = (state: RootState): number => {
  const total = CARD_SECTIONS.length
  const completed = CARD_SECTIONS.filter(
    (section) => state.cardEditor[section].isComplete
  ).length
  return Math.round((completed / total) * 100)
}

export const selectCardStatus = (state: RootState): CardStatus =>
  state.cardEditor.status
