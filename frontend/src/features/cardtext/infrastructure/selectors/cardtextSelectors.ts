import { RootState } from '@app/state'
import type { CardtextValue } from '@cardtext/domain/types'

export const selectCardtextState = (state: RootState) => state.cardtext

export const selectCardtextValue = (state: RootState): CardtextValue =>
  state.cardtext.value

export const selectCardtextPlainText = (state: RootState): string =>
  state.cardtext.plainText

export const selectCardtextIsComplete = (state: RootState): boolean =>
  state.cardtext.isComplete

export const selectCardtextLines = (state: RootState): number =>
  state.cardtext.cardtextLines
