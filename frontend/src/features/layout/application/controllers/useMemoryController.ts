import { AppDispatch } from '@app/state'
import {
  setMemoryCrop,
  // setChoiceMemorySection,
  setExpendMemoryCard,
  setLockExpendMemoryCard,
} from '../../infrastructure/state/memory.slice'
import type { MemoryCardInfo } from '../../domain/types'

export const useMemoryController = (dispatch: AppDispatch) => ({
  setMemoryCrop: (payload: any) => dispatch(setMemoryCrop(payload)),
  // setChoiceMemorySection: (payload: Partial<MemorySection>) =>
  //   dispatch(setChoiceMemorySection(payload)),
  setExpendMemoryCard: (payload: MemoryCardInfo | null) =>
    dispatch(setExpendMemoryCard(payload)),
  setLockExpendMemoryCard: (value: boolean) =>
    dispatch(setLockExpendMemoryCard(value)),
})
