import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { CardSection } from '@shared/config/constants'
import type { CardEditorState } from '../../domain/types'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import { selectIsAromaComplete } from '@aroma/infrastructure/selectors'
import {
  selectIsDateComplete,
  selectCardPieListPanelRowCount,
} from '@date/infrastructure/selectors'

/**
 * Editor UI state with per-section `isComplete` aligned to the same sources as
 * `selectIsCardReady` (not the raw `cardEditor` mirror), so CardPie and tooling
 * stay in sync when sagas omit `setSectionComplete`.
 */
export const selectCardEditorState = createSelector(
  [
    (state: RootState) => state.cardEditor,
    selectIsEnvelopeReady,
    selectCardphotoIsComplete,
    selectCardtextIsComplete,
    selectIsAromaComplete,
    selectIsDateComplete,
  ],
  (
    editor,
    envelopeReady,
    cardphoto,
    cardtext,
    aroma,
    date,
  ): CardEditorState => ({
    ...editor,
    cardphoto: { ...editor.cardphoto, isComplete: cardphoto },
    cardtext: { ...editor.cardtext, isComplete: cardtext },
    envelope: { ...editor.envelope, isComplete: envelopeReady },
    aroma: { ...editor.aroma, isComplete: aroma },
    date: { ...editor.date, isComplete: date },
  }),
)

export const selectCardEditorId = (state: RootState): string =>
  state.cardEditor.id

export const selectIsCardEditorCompleted = createSelector(
  [selectCardEditorState],
  (editor): boolean =>
    editor.cardphoto.isComplete &&
    editor.cardtext.isComplete &&
    editor.envelope.isComplete &&
    editor.aroma.isComplete &&
    editor.date.isComplete,
)

export const selectSectionComplete = (
  state: RootState,
  section: CardSection,
): boolean => {
  switch (section) {
    case 'envelope':
      return selectIsEnvelopeReady(state)
    case 'cardphoto':
      return selectCardphotoIsComplete(state)
    case 'cardtext':
      return selectCardtextIsComplete(state)
    case 'aroma':
      return selectIsAromaComplete(state)
    case 'date':
      return selectIsDateComplete(state)
    default:
      return false
  }
}

export const selectPieProgress = createSelector(
  [selectCardEditorState],
  (editor) => {
    const completedCount = [
      editor.cardphoto.isComplete,
      editor.cardtext.isComplete,
      editor.envelope.isComplete,
      editor.aroma.isComplete,
      editor.date.isComplete,
    ].filter(Boolean).length
    return {
      sections: {
        cardphoto: editor.cardphoto.isComplete,
        cardtext: editor.cardtext.isComplete,
        envelope: editor.envelope.isComplete,
        aroma: editor.aroma.isComplete,
        date: editor.date.isComplete,
      },
      isAllComplete:
        editor.cardphoto.isComplete &&
        editor.cardtext.isComplete &&
        editor.envelope.isComplete &&
        editor.aroma.isComplete &&
        editor.date.isComplete,
      isRainbowActive: editor.isRainbowActive,
      isRainbowStopping: editor.isRainbowStopping,
      progress: completedCount,
    }
  },
)

/**
 * Бейдж `cardPie` в тулбарах date / editorPie: число строк списка (план / день),
 * но не меньше 1, если заполнена хотя бы одна секция открытки (без выбранной даты).
 */
export const selectCardPieToolbarBadgeCount = createSelector(
  [selectCardPieListPanelRowCount, selectPieProgress],
  (listRowCount, pie) => Math.max(listRowCount, pie.progress > 0 ? 1 : 0),
)

/** Ready for CardPie favorite save: all required sections except date. */
export const selectIsCardPieFavoriteReady = createSelector(
  [selectPieProgress],
  (pie) =>
    pie.sections.cardphoto &&
    pie.sections.cardtext &&
    pie.sections.envelope &&
    pie.sections.aroma,
)

export const selectHoveredSection = (state: RootState) =>
  state.cardEditor.hoveredSection

export const selectIsSectionHovered = createSelector(
  [selectHoveredSection, (_state: RootState, section: CardSection) => section],
  (hoveredSection, section) => hoveredSection === section,
)

// export const selectPieUIIcons = createSelector(
//   [selectCardEditorState],
//   (editor) => ({
//     isRainbowActive: editor.isRainbowActive,
//     isRainbowStopping: editor.isRainbowStopping,
//     sections: {
//       cardphoto: editor.cardphoto.isComplete,
//       cardtext: editor.cardtext.isComplete,
//       envelope: editor.envelope.isComplete,
//       aroma: editor.aroma.isComplete,
//       date: editor.date.isComplete,
//     },
//   }),
// )

// export const selectActiveCardFullData = createSelector(
//   [
//     selectCardEditorState,
//     selectCardtextSessionData,
//     selectCardphotoSessionRecord,
//     selectAromaState,
//     selectDateState,
//   ],
//   (editor, text, photo, aroma, date) => ({
//     ...editor,
//     data: {
//       cardtext: text,
//       cardphoto: photo,
//       aroma,
//       date,
//     },
//   }),
// )

// export const selectPieDataByContext = createSelector(
//   [
//     (state: RootState) => state,
//     (_state, status: CardStatus) => status,
//     (_state, _status, id?: string) => id,
//   ],
//   (state, status, id) => {
//     if (status === 'processed') {
//       return selectActiveCardFullData(state)
//     }

//     return null
//   },
// )
