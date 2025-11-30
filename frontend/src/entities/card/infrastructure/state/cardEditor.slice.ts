import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { WritableDraft } from 'immer'
import type {
  Card,
  CardSection,
  Completion,
  CardStatus,
} from '@entities/card/domain/types'

const initialCompletion = { isComplete: false } as const

const initialState: Card = {
  id: null,
  status: 'inProgress',
  cardphoto: initialCompletion,
  cardtext: initialCompletion,
  envelope: initialCompletion,
  aroma: initialCompletion,
  date: initialCompletion,
}

function makeInitial<T = any>(): Completion<T> {
  return { isComplete: false }
}

export const cardEditorSlice = createSlice({
  name: 'cardEditor',
  initialState,
  reducers: {
    setSectionComplete<K extends CardSection>(
      state: WritableDraft<Card>,
      action: PayloadAction<{
        section: K
        data: Card[K] extends Completion<infer T> ? T : never
      }>
    ) {
      const { section, data } = action.payload
      const completion: Completion<typeof data> = {
        isComplete: true,
        data,
      }
      state[section] = completion as WritableDraft<Card>[K]
    },

    resetSection<K extends CardSection>(
      state: WritableDraft<Card>,
      action: PayloadAction<K>
    ) {
      const section = action.payload
      state[section] = makeInitial() as WritableDraft<Card>[K]
    },

    setEditorId(state, action: PayloadAction<string>) {
      state.id = action.payload
    },

    setStatus(state, action: PayloadAction<CardStatus>) {
      state.status = action.payload
    },

    resetEditor(state) {
      Object.assign(state, initialState)
    },
  },
})

export const {
  setSectionComplete,
  resetSection,
  setEditorId,
  setStatus,
  resetEditor,
} = cardEditorSlice.actions

export default cardEditorSlice.reducer
