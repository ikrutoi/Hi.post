import { RootState } from '@app/state'
import type {
  CardtextValue,
  CardtextStyle,
  CardtextSessionRecord,
} from '../../domain/types'
import { createSelector } from '@reduxjs/toolkit'

export const selectCardtextState = (state: RootState) => state.cardtext

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

export const selectFontSizeStep = (state: RootState): number =>
  state.cardtext.style.fontSizeStep

export const selectFontFamily = (state: RootState): string =>
  state.cardtext.style.fontFamily

export const selectFontColor = (state: RootState): string =>
  state.cardtext.style.color

export const selectCardtextSessionRecord = (state: RootState): CardtextStyle =>
  state.cardtext.style

export const selectCardtextSessionData = createSelector(
  [(state: RootState) => state.cardtext],
  (cardtext): CardtextSessionRecord => {
    const { assetId, value, style, plainText, cardtextLines } = cardtext
    return { assetId, value, style, plainText, cardtextLines }
  },
)
