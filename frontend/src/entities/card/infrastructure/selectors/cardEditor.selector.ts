import type { RootState } from '@app/state'
import { CARD_SECTIONS } from '@entities/card/domain/types'
import type {
  CardSection,
  CardTemplateSection,
  CardEditor,
} from '@entities/card/domain/types'

export const selectCardEditor = (state: RootState): CardEditor =>
  state.cardEditor

export const selectSection = (state: RootState, section: CardSection) =>
  state.cardEditor[section]

export const selectIsSectionComplete = (
  state: RootState,
  section: CardSection
): boolean => state.cardEditor[section].isComplete

export const selectTemplateId = (
  state: RootState,
  section: CardTemplateSection
): string | undefined => state.cardEditor.templates[section]

export const selectIncompleteSections = (state: RootState): CardSection[] =>
  CARD_SECTIONS.filter((section) => !state.cardEditor[section].isComplete)

export const selectEditorProgress = (state: RootState): number => {
  const total = CARD_SECTIONS.length
  const completed = CARD_SECTIONS.filter(
    (section) => state.cardEditor[section].isComplete
  ).length
  return Math.round((completed / total) * 100)
}
