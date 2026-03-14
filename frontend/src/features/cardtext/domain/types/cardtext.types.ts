import {
  initialCardtextEditorState,
  type CardtextState,
  type CardtextEditorUIState,
} from '../editor/types'
import {
  initialCardtextTemplatesState,
  type CardtextTemplatesListState,
  type CardtextTemplatesUIState,
} from '../templates/types'

/** Обратная совместимость: объединённый UI (редактор + шаблоны). */
export type CardtextUIState = CardtextEditorUIState & CardtextTemplatesUIState

export interface CardtextSliceState
  extends CardtextState,
    CardtextEditorUIState,
    CardtextTemplatesUIState {
  templatesList: CardtextTemplatesListState
}

export const initialCardtextState: CardtextSliceState = {
  ...initialCardtextEditorState,
  ...initialCardtextTemplatesState,
}
