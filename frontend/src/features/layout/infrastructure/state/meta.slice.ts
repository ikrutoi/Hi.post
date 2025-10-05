import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  FullCardPersonalId,
  SliderLetter,
  SliderLetterPayload,
  CartCardsPayload,
  MetaState,
} from '../../domain/types'
import type { DispatchDate } from '@entities/date/domain/types'

const initialState: MetaState = {
  fullCard: false,
  addFullCard: false,
  selectedCard: false,
  maxCardsList: null,
  sliderLetter: null,
  sliderLetterPayload: null,
  sliderLine: null,
  deltaEnd: null,
  personalId: null,
  fullCardPersonalId: {},
  currentDate: null,
  cartCards: null,
  dateCartCards: null,
  lockDateCartCards: null,
  choiceClip: false,
}

export const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    setFullCard(state, action: PayloadAction<boolean>) {
      state.fullCard = action.payload
    },
    setAddFullCard(state, action: PayloadAction<boolean>) {
      state.addFullCard = action.payload
    },
    setSelectedCard(state, action: PayloadAction<boolean>) {
      state.selectedCard = action.payload
    },
    setMaxCardsList(state, action: PayloadAction<number | null>) {
      state.maxCardsList = action.payload
    },
    setSliderLetter(state, action: PayloadAction<SliderLetter | null>) {
      state.sliderLetter = action.payload
    },
    setSliderLetterPayload(
      state,
      action: PayloadAction<SliderLetterPayload | null>
    ) {
      state.sliderLetterPayload = action.payload
    },
    setSliderLine(state, action: PayloadAction<number | null>) {
      state.sliderLine = action.payload
    },
    setDeltaEnd(state, action: PayloadAction<number | null>) {
      state.deltaEnd = action.payload
    },
    setPersonalId(state, action: PayloadAction<string | null>) {
      state.personalId = action.payload
    },
    setFullCardPersonalId(
      state,
      action: PayloadAction<Partial<FullCardPersonalId>>
    ) {
      state.fullCardPersonalId = {
        ...state.fullCardPersonalId,
        ...action.payload,
      }
    },
    setCurrentDate(state, action: PayloadAction<string | null>) {
      state.currentDate = action.payload
    },
    setCartCards(state, action: PayloadAction<CartCardsPayload | null>) {
      state.cartCards = action.payload
    },
    setDateCartCards(state, action: PayloadAction<DispatchDate | null>) {
      state.dateCartCards = action.payload
    },
    setLockDateCartCards(state, action: PayloadAction<boolean | null>) {
      state.lockDateCartCards = action.payload
    },
    setChoiceClip(state, action: PayloadAction<boolean>) {
      state.choiceClip = action.payload
    },
  },
})

export const {
  setFullCard,
  setAddFullCard,
  setSelectedCard,
  setMaxCardsList,
  setSliderLetter,
  setSliderLetterPayload,
  setSliderLine,
  setDeltaEnd,
  setPersonalId,
  setFullCardPersonalId,
  setCurrentDate,
  setCartCards,
  setDateCartCards,
  setLockDateCartCards,
  setChoiceClip,
} = metaSlice.actions

export default metaSlice.reducer
