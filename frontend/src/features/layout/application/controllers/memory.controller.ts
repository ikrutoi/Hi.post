import { AppDispatch } from '@app/state'
import {
  addMemoryCrop,
  // setChoiceMemorySection,
  setExpendMemoryCard,
  setLockExpendMemoryCard,
} from '../../infrastructure/state/memory.slice'
import type { MemoryCardInfo } from '../../domain/types'

export const memoryController = (dispatch: AppDispatch) => ({
  setMemoryCrop: (payload: any) => dispatch(addMemoryCrop(payload)),
  // setChoiceMemorySection: (payload: Partial<MemorySection>) =>
  //   dispatch(setChoiceMemorySection(payload)),
  setExpendCard: (payload: MemoryCardInfo | null) =>
    dispatch(setExpendMemoryCard(payload)),
  setLockExpendCard: (value: boolean) =>
    dispatch(setLockExpendMemoryCard(value)),
})
