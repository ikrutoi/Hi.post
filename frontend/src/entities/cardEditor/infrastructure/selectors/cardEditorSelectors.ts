import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { CardSection } from '@shared/config/constants'
import type { CardEditorState } from '../../domain/types'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'

/** Editor state with envelope.isComplete derived from sender/recipient (single source of truth). */
export const selectCardEditorState = createSelector(
  [(state: RootState) => state.cardEditor, selectIsEnvelopeReady],
  (editor, envelopeReady): CardEditorState => ({
    ...editor,
    envelope: { ...editor.envelope, isComplete: envelopeReady },
  }),
)

export const selectCardEditorId = (state: RootState): string =>
  state.cardEditor.id

export const selectIsCardEditorCompleted = createSelector(
  [
    (state: RootState) => state.cardEditor,
    selectIsEnvelopeReady,
  ],
  (editor, envelopeReady): boolean =>
    editor.cardphoto.isComplete &&
    editor.cardtext.isComplete &&
    envelopeReady &&
    editor.aroma.isComplete &&
    editor.date.isComplete,
)

export const selectSectionComplete = (
  state: RootState,
  section: CardSection,
): boolean =>
  section === 'envelope'
    ? selectIsEnvelopeReady(state)
    : state.cardEditor[section].isComplete

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
