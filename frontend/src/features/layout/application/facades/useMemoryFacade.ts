import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectMemoryCrop,
  // selectChoiceMemorySection,
  selectExpendMemoryCard,
  selectLockExpendMemoryCard,
} from '../../infrastructure/selectors'
import { useMemoryController } from '../../application/controllers'

export const useMemoryFacade = () => {
  const dispatch = useAppDispatch()

  const memoryCrop = useAppSelector(selectMemoryCrop)
  // const choiceMemorySection = useAppSelector(selectChoiceMemorySection)
  const expendMemoryCard = useAppSelector(selectExpendMemoryCard)
  const lockExpendMemoryCard = useAppSelector(selectLockExpendMemoryCard)

  const {
    setMemoryCrop,
    // setChoiceMemorySection,
    setExpendMemoryCard,
    setLockExpendMemoryCard,
  } = useMemoryController(dispatch)

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
      setExpendMemoryCard,
      setLockExpendMemoryCard,
    },
  }
}
