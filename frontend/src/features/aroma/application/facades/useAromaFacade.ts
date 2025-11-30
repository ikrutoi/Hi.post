import { useSelector } from 'react-redux'
import { selectAroma as aroma } from '../../infrastructure/selectors'
import { useAromaController } from '../controllers'

export const useAromaFacade = () => {
  const selectedAroma = useSelector(aroma)
  const { selectAroma, resetAroma, selectByIndex } = useAromaController()

  return {
    state: {
      selectedAroma,
    },
    actions: {
      selectAroma,
      resetAroma,
      selectByIndex,
    },
  }
}
