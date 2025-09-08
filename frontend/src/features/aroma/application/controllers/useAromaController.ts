import { useAppSelector } from '@app/hooks/useAppSelector'
import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useEffect, useState } from 'react'
import { addAroma } from '@features/cardedit/application/state/cardEditSlice'
import { setActiveSections } from '@features/layout/application/state/layoutSlice'
import type { AromaItem } from '@entities/aroma/domain/aromaTypes'

export const useAromaController = () => {
  const dispatch = useAppDispatch()
  const aromaFromStore = useAppSelector((state) => state.cardEdit.aroma)
  const activeSections = useAppSelector(
    (state) => state.layout.setActiveSections
  )
  const { sizeCard, remSize } = useAppSelector((state) => state.layout)

  const [selectedAroma, setSelectedAroma] = useState<AromaItem | null>(null)

  useEffect(() => {
    setSelectedAroma(aromaFromStore)
  }, [aromaFromStore])

  useEffect(() => {
    if (selectedAroma) {
      dispatch(setActiveSections({ ...activeSections, aroma: true }))
    }
  }, [selectedAroma])

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    if (selectedAroma) {
      dispatch(addAroma(selectedAroma))
    }
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
