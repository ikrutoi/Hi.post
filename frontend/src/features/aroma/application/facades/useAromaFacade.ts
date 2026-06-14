import { aromaSlotOrder } from '@entities/aroma/domain/types'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setAroma,
  clear,
  openAromaPreview,
  closeAromaPreview,
} from '../../infrastructure/state'
import {
  selectSelectedAroma,
  selectIsAromaComplete,
  selectAromaPreviewOpen,
  selectAromaPreviewIndex,
} from '../../infrastructure/selectors'
import type { AromaItem, AromaSlot } from '@entities/aroma/domain/types'

export const useAromaFacade = () => {
  const dispatch = useAppDispatch()

  const selectedAroma = useAppSelector(selectSelectedAroma)
  const isComplete = useAppSelector(selectIsAromaComplete)
  const previewOpen = useAppSelector(selectAromaPreviewOpen)
  const previewIndex = useAppSelector(selectAromaPreviewIndex)

  const chooseAroma = useCallback(
    (aroma: AromaItem) => {
      dispatch(setAroma(aroma))
    },
    [dispatch],
  )

  const openPreview = useCallback(
    (index: AromaSlot) => {
      dispatch(openAromaPreview(index))
    },
    [dispatch],
  )

  const closePreview = useCallback(() => {
    dispatch(closeAromaPreview())
  }, [dispatch])

  const clearAroma = useCallback(() => {
    dispatch(clear())
  }, [dispatch])

  return {
    selectedAroma,
    isComplete,
    previewOpen,
    previewIndex,
    aromaSlotOrder,

    chooseAroma,
    openPreview,
    closePreview,
    clearAroma,
  }
}
