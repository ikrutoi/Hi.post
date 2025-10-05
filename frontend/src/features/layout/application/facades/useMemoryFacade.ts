import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectMemoryCrop,
  // selectChoiceMemorySection,
  selectExpendMemoryCard,
  selectLockExpendMemoryCard,
} from '../../infrastructure/selectors'
import { memoryController } from '../../application/controllers'

export const useMemoryFacade = () => {
  const dispatch = useAppDispatch()

  const memoryCrop = useAppSelector(selectMemoryCrop)
  // const choiceMemorySection = useAppSelector(selectChoiceMemorySection)
  const expendMemoryCard = useAppSelector(selectExpendMemoryCard)
  const lockExpendMemoryCard = useAppSelector(selectLockExpendMemoryCard)

  const {
    setMemoryCrop,
    // setChoiceMemorySection,
    setExpendCard,
    setLockExpendCard,
  } = memoryController(dispatch)

  return {
    memory: {
      memoryCrop,
      // choiceMemorySection,
      expendMemoryCard,
      lockExpendMemoryCard,
    },
    actions: {
      setMemoryCrop,
      // setChoiceMemorySection,
      setExpendCard,
      setLockExpendCard,
    },
  }
}
