import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  // MemorySection,
  MemoryCardInfo,
  MemoryState,
} from '../../domain/types'

const initialState: MemoryState = {
  memoryCrop: null,
  // choiceMemorySection: {},
  expendMemoryCard: null,
  lockExpendMemoryCard: false,
}

export const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    setMemoryCrop(state, action: PayloadAction<Blob | null>) {
      state.memoryCrop = action.payload
    },
    // setChoiceMemorySection(
    //   state,
    //   action: PayloadAction<Partial<MemorySection>>
    // ) {
    //   state.choiceMemorySection = {
    //     ...state.choiceMemorySection,
    //     ...action.payload,
    //   }
    // },
    setExpendMemoryCard(state, action: PayloadAction<MemoryCardInfo | null>) {
      state.expendMemoryCard = action.payload
    },
    setLockExpendMemoryCard(state, action: PayloadAction<boolean>) {
      state.lockExpendMemoryCard = action.payload
    },
  },
})

export const {
  setMemoryCrop,
  // setChoiceMemorySection,
  setExpendMemoryCard,
  setLockExpendMemoryCard,
} = memorySlice.actions

export default memorySlice.reducer
