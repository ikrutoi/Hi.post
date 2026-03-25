import {
  initialCardtextEditorState,
  type CardtextState,
  type CardtextEditorUIState,
} from '../editor/editor.types'
import {
  initialCardtextTemplatesState,
  type CardtextTemplatesListState,
  type CardtextTemplatesUIState,
} from '../templates/types'

export type CardtextUIState = CardtextEditorUIState & CardtextTemplatesUIState

export interface CardtextSliceState
  extends CardtextState, CardtextEditorUIState, CardtextTemplatesUIState {
  templatesList: CardtextTemplatesListState
}

export const initialCardtextState: CardtextSliceState = {
  ...initialCardtextEditorState,
  ...initialCardtextTemplatesState,
}
