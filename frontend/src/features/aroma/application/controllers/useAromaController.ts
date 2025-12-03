import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setAroma, clearAroma } from '../../infrastructure/state'
import {
  selectSelectedAroma,
  selectIsAromaComplete,
} from '../../infrastructure/selectors'
import type { AromaItem } from '@entities/aroma/domain/types'

export const useAromaController = () => {
  const dispatch = useAppDispatch()

  const selectedAroma = useAppSelector(selectSelectedAroma)
  const isAromaComplete = useAppSelector(selectIsAromaComplete)

  const chooseAroma = (aroma: AromaItem) => {
    dispatch(setAroma(aroma))
  }

  const clear = () => {
    dispatch(clearAroma())
  }

  return {
    state: {
      selectedAroma,
      isAromaComplete,
    },
    actions: {
      chooseAroma,
      clear,
    },
  }
}
