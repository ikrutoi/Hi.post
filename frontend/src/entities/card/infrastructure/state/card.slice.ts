import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  CardEditor,
  Completion,
  CardphotoState,
  CardtextState,
  EnvelopeState,
  AromaItem,
  DispatchDate,
} from '../../domain/types'

const isIncomplete = <T>(): Completion<T> => ({ isComplete: false })

const initialState: CardEditor = {
  cardphoto: isIncomplete<CardphotoState>(),
  cardtext: isIncomplete<CardtextState>(),
  envelope: isIncomplete<EnvelopeState>(),
  aroma: isIncomplete<AromaItem>(),
  date: isIncomplete<DispatchDate>(),
  id: null,
}

const cardEditorSlice = createSlice({
  name: 'cardEditor',
  initialState,
  reducers: {
    setCardphoto(state, action: PayloadAction<CardphotoState>) {
      state.cardphoto = { isComplete: true, data: action.payload }
    },
    setCardtext(state, action: PayloadAction<CardtextState>) {
      state.cardtext = { isComplete: true, data: action.payload }
    },
    setEnvelope(state, action: PayloadAction<EnvelopeState>) {
      state.envelope = { isComplete: true, data: action.payload }
    },
    setAroma(state, action: PayloadAction<AromaItem>) {
      state.aroma = { isComplete: true, data: action.payload }
    },
    setDate(state, action: PayloadAction<DispatchDate>) {
      state.date = { isComplete: true, data: action.payload }
    },
    setCardId(state, action: PayloadAction<string>) {
      state.id = action.payload
    },
    resetCardEditor(state) {
      state.cardphoto = isIncomplete<CardphotoState>()
      state.cardtext = isIncomplete<CardtextState>()
      state.envelope = isIncomplete<EnvelopeState>()
      state.aroma = isIncomplete<AromaItem>()
      state.date = isIncomplete<DispatchDate>()
      state.id = null
    },
  },
})

export const {
  setCardphoto,
  setCardtext,
  setEnvelope,
  setAroma,
  setDate,
  setCardId,
  resetCardEditor,
} = cardEditorSlice.actions

export default cardEditorSlice.reducer
