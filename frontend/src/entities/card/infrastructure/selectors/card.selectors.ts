import type { RootState } from '@app/state'
import { CARD_SECTIONS } from '../../domain/types'
import type { CardItem, CardSection } from '../../domain/types'

export const selectCardItem = (state: RootState): CardItem => state.card

export const selectCardSection = <T extends CardSection>(
  state: RootState,
  section: T
): CardItem[T] => state.card[section]

export const selectCardId = (state: RootState): string | null => state.card.id

export const selectHasAnySectionComplete = (state: RootState): boolean => {
  const card = state.card
  return CARD_SECTIONS.some((section) => card[section].isComplete)
}

export const selectIsCardComplete = (state: RootState): boolean => {
  const card = selectCardItem(state)
  return CARD_SECTIONS.every((section) => card[section].isComplete)
}

export const selectCompletedSection = (state: RootState): CardSection[] => {
  const card = state.card
  return CARD_SECTIONS.filter((section) => card[section].isComplete)
}

export const selectCompletionMap = (
  state: RootState
): Record<CardSection, boolean> => {
  const card = state.card
  return CARD_SECTIONS.reduce(
    (acc, section) => {
      acc[section] = card[section].isComplete
      return acc
    },
    {} as Record<CardSection, boolean>
  )
}

export const selectIncompleteSections = (state: RootState): CardSection[] => {
  const card = selectCardItem(state)
  return CARD_SECTIONS.filter((section) => !card[section].isComplete)
}
