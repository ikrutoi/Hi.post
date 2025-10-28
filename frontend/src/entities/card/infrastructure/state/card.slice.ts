import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  CardItem,
  Completion,
  CardphotoState,
  CardtextState,
  EnvelopeState,
  AromaState,
  DispatchDate,
} from '../../domain/types'

const isIncomplete = <T>(): Completion<T> => ({ isComplete: false })

const initialState: CardItem = {
  cardphoto: isIncomplete<CardphotoState>(),
  cardtext: isIncomplete<CardtextState>(),
  envelope: isIncomplete<EnvelopeState>(),
  aroma: isIncomplete<AromaState>(),
  date: isIncomplete<DispatchDate>(),
  id: null,
}

export const cardSlice = createSlice({
  name: 'card',
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
    setAroma(state, action: PayloadAction<AromaState>) {
      state.aroma = { isComplete: true, data: action.payload }
    },
    setDate(state, action: PayloadAction<DispatchDate>) {
      state.date = { isComplete: true, data: action.payload }
    },
    setCardId(state, action: PayloadAction<string>) {
      state.id = action.payload
    },
    resetCard(state) {
      state.cardphoto = isIncomplete<CardphotoState>()
      state.cardtext = isIncomplete<CardtextState>()
      state.envelope = isIncomplete<EnvelopeState>()
      state.aroma = isIncomplete<AromaState>()
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
  resetCard,
} = cardSlice.actions

export default cardSlice.reducer
