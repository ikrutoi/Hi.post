import { aromaSlotOrder } from '@entities/aroma/domain/types'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setViewAroma, setAroma, clear } from '../../infrastructure/state'
import {
  selectSelectedAroma,
  selectViewAroma,
  selectAromaDisplayAroma,
  selectIsAromaComplete,
} from '../../infrastructure/selectors'
import type { AromaItem } from '@entities/aroma/domain/types'

export const useAromaFacade = () => {
  const dispatch = useAppDispatch()

  const selectedAroma = useAppSelector(selectSelectedAroma)
  const viewAroma = useAppSelector(selectViewAroma)
  const displayAroma = useAppSelector(selectAromaDisplayAroma)
  const isComplete = useAppSelector(selectIsAromaComplete)

  const previewAroma = useCallback(
    (aroma: AromaItem) => {
      dispatch(setViewAroma(aroma))
    },
    [dispatch],
  )

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
    viewAroma,
    displayAroma,
    isComplete,
    aromaSlotOrder,
    previewAroma,
    chooseAroma,
    clearAroma,
  }
}
