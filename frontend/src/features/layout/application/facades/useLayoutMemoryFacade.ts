import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { memoryActions } from '../state/layoutActions'
import {
  selectExpendMemoryCard,
  selectLockExpendMemoryCard,
  selectMemoryCrop,
  selectChoiceMemorySection,
} from '../state/layoutSelectors'

export const useLayoutMemoryFacade = () => {
  const dispatch = useAppDispatch()

  return {
    expendCard: useAppSelector(selectExpendMemoryCard),
    lockExpendCard: useAppSelector(selectLockExpendMemoryCard),
    memoryCrop: useAppSelector(selectMemoryCrop),
    choiceMemorySection: useAppSelector(selectChoiceMemorySection),

    setExpendCard: (payload: any) =>
      dispatch(memoryActions.setExpendMemoryCard(payload)),
    setLockExpendCard: (value: boolean) =>
      dispatch(memoryActions.setLockExpendMemoryCard(value)),
    setMemoryCrop: (payload: any) =>
      dispatch(memoryActions.addMemoryCrop(payload)),
    setChoiceMemorySection: (payload: Partial<any>) =>
      dispatch(memoryActions.setChoiceMemorySection(payload)),
  }
}
