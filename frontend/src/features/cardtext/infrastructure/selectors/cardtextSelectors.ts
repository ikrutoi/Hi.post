import { RootState } from '@app/state'
import type {
  CardtextValue,
  CardtextStyle,
  CardtextTemplateContent,
} from '../../domain/types'
import { createSelector } from '@reduxjs/toolkit'

export const selectCardtextState = (state: RootState) => state.cardtext

export const selectCardtextAddTemplateOpen = (state: RootState): boolean =>
  state.cardtext.isAddTemplateOpen ?? false

export const selectCardtextTemplatesListItems = (state: RootState) =>
  state.cardtext.templatesList?.items ?? []

export const selectCardtextTemplatesListLoading = (state: RootState): boolean =>
  state.cardtext.templatesList?.isLoading ?? false

export const selectCardtextShowViewMode = (state: RootState): boolean =>
  state.cardtext.showCardtextView ?? false

export const selectCardtextFocusRequested = (state: RootState): boolean =>
  state.cardtext.requestCardtextFocus ?? false

export const selectCardtextValue = (state: RootState): CardtextValue =>
  state.cardtext.value

export const selectCardtextPlainText = (state: RootState): string =>
  state.cardtext.plainText

export const selectCardtextIsComplete = (state: RootState): boolean =>
  state.cardtext.isComplete

export const selectCardtextLines = (state: RootState): number =>
  state.cardtext.cardtextLines

export const selectCardtextStyle = (state: RootState): CardtextStyle =>
  state.cardtext.style

export const selectCardtextTitle = (state: RootState): string =>
  state.cardtext.title

export const selectCardtextFavorite = (state: RootState): boolean =>
  state.cardtext.favorite === true

export const selectCurrentCardtextTemplateId = (state: RootState): string | null =>
  state.cardtext.currentTemplateId ?? null

export const selectFontSizeStep = (state: RootState): number =>
  state.cardtext.style.fontSizeStep

export const selectFontFamily = (state: RootState): string =>
  state.cardtext.style.fontFamily

export const selectFontColor = (state: RootState): string =>
  state.cardtext.style.color

export const selectCardtextSessionData = createSelector(
  [(state: RootState) => state.cardtext],
  (cardtext): CardtextTemplateContent & { templateId: string | null } => {
    const { value, style, title, plainText, cardtextLines, applied, favorite } =
      cardtext
    return {
      templateId: cardtext.currentTemplateId ?? null,
      value,
      style,
      title,
      plainText,
      cardtextLines,
      applied,
      favorite,
    }
  },
)
