import { aromaIndexes } from '@entities/aroma/domain/types'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setAroma, clear } from '../../infrastructure/state'
import {
  selectSelectedAroma,
  selectIsAromaComplete,
} from '../../infrastructure/selectors'
import type { AromaItem } from '@entities/aroma/domain/types'

export const useAromaFacade = () => {
  const dispatch = useAppDispatch()

  const selectedAroma = useAppSelector(selectSelectedAroma)
  const isComplete = useAppSelector(selectIsAromaComplete)

  const chooseAroma = useCallback(
    (aroma: AromaItem) => {
      dispatch(setAroma(aroma))
    },
    [dispatch],
  )

  const clearAroma = useCallback(() => {
    dispatch(clear())
  }, [dispatch])

  return {
    selectedAroma,
    isComplete,
    aromaIndexes,

    chooseAroma,
    clearAroma,
  }
}
