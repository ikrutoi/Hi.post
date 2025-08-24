import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  DraftLayoutState,
  MemorySection,
  MemoryCardInfo,
} from '../../../../domain/model/layoutTypes'

export const addMemoryCrop = (
  state: DraftLayoutState,
  action: PayloadAction<any>
) => {
  state.memoryCrop = action.payload
}

export const setChoiceMemorySection = (
  state: DraftLayoutState,
  action: PayloadAction<Partial<MemorySection>>
) => {
  state.choiceMemorySection = {
    ...state.choiceMemorySection,
    ...action.payload,
  }
}

export const setExpendMemoryCard = (
  state: DraftLayoutState,
  action: PayloadAction<MemoryCardInfo | null>
) => {
  state.expendMemoryCard = action.payload
}

export const setLockExpendMemoryCard = (
  state: DraftLayoutState,
  action: PayloadAction<boolean>
) => {
  state.lockExpendMemoryCard = action.payload
}
