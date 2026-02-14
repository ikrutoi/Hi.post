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
  section: CardSection,
): boolean => state.cardEditor[section].isComplete

import { createSelector } from '@reduxjs/toolkit'
import { CardStatus } from '@entities/card/domain/types'
import { selectDateState } from '@features/date/infrastructure/selectors'
import { selectAromaState } from '@features/aroma/infrastructure/selectors'
import { selectCardphotoSessionRecord } from '@features/cardphoto/infrastructure/selectors'
import { selectCardtextSessionData } from '@features/cardtext/infrastructure/selectors'

export const selectPieHubStatus = createSelector(
  [selectCardEditorState],
  (editor) => {
    const completedSections = [
      editor.cardphoto.isComplete,
      editor.cardtext.isComplete,
      editor.envelope.isComplete,
      editor.aroma.isComplete,
      editor.date.isComplete,
    ].filter(Boolean).length

    return {
      isAllComplete: editor.isCompleted,
      isReadyForTemplate:
        editor.cardphoto.isComplete &&
        editor.cardtext.isComplete &&
        editor.envelope.isComplete &&
        editor.aroma.isComplete,
      progress: completedSections,
    }
  },
)

export const selectActiveCardFullData = createSelector(
  [
    selectCardEditorState,
    selectCardtextSessionData,
    selectCardphotoSessionRecord,
    selectAromaState,
    selectDateState,
  ],
  (editor, text, photo, aroma, date) => ({
    ...editor,
    data: {
      cardtext: text,
      cardphoto: photo,
      aroma,
      date,
    },
  }),
)

export const selectPieDataByContext = createSelector(
  [
    (state: RootState) => state,
    (_state, status: CardStatus) => status,
    (_state, _status, id?: string) => id,
  ],
  (state, status, id) => {
    if (status === 'processed') {
      return selectActiveCardFullData(state)
    }

    // Когда появится Корзина (Cart), тут будет поиск по ID в таблице Cart
    // if (status === 'cart' && id) { ... }

    return null
  },
)
