import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { addAroma } from '@features/cardedit/application/state/cardEditSlice'
import { setActiveSections } from '@features/layout/application/state/layoutSlice'
import { selectAroma } from '../selectors'
import type { AromaItem } from '@entities/aroma/domain/types'

export const useAromaController = () => {
  const dispatch = useAppDispatch()
  const aromaFromStore = useAppSelector(selectAroma)
  const {
    sizeCard,
    remSize,
    setActiveSections: activeSections,
  } = useAppSelector((state) => state.layout)

  const [selectedAroma, setSelectedAroma] = useState<AromaItem | null>(null)

  useEffect(() => {
    setSelectedAroma(aromaFromStore)
  }, [aromaFromStore])

  useEffect(() => {
    if (selectedAroma) {
      dispatch(setActiveSections({ ...activeSections, aroma: true }))
    }
  }, [selectedAroma])

  const submitAroma = () => {
    if (selectedAroma) {
      dispatch(addAroma(selectedAroma))
    }
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    submitAroma()
  }

  const tileSize = {
    height: (sizeCard.height - 6 * remSize) / 4,
    width: (sizeCard.width - 6 * remSize) / 4,
  }

  return {
    selectedAroma,
    setSelectedAroma,
    handleSubmit,
    tileSize,
  }
}
