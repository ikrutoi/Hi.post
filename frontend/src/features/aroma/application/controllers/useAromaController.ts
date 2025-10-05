import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useLayoutFacade } from '@layout/application/facades'
import { updateAroma } from '@features/aroma/infrastructure/state/aroma.slice'
import { setActiveSection } from '@layout/infrastructure/state'
import { selectAroma } from '../../infrastructure/selectors'
import type { AromaItem } from '@entities/aroma/domain/types'

export const useAromaController = () => {
  const dispatch = useAppDispatch()
  const storeAroma = useAppSelector(selectAroma)
  const activeSection = useAppSelector(
    (state) => state.layout.section.activeSection
  )

  const {
    layout: { sizeCard, remSize },
  } = useLayoutFacade()

  useEffect(() => {
    if (storeAroma) {
      dispatch(setActiveSection('aroma'))
    }
  }, [storeAroma])

  const submitAroma = () => {
    dispatch(updateAroma(storeAroma))
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    submitAroma()
  }

  const tileSize =
    remSize !== null
      ? {
          height: (sizeCard.height - 6 * remSize) / 4,
          width: (sizeCard.width - 6 * remSize) / 4,
        }
      : null

  return {
    selectedAroma: storeAroma,
    handleSubmit,
    tileSize,
  }
}
