import { useAppDispatch, useAppSelector } from '@app/hooks'
import { aromaActions } from '@aroma/infrastructure/state'
import { setActiveSection } from '@layout/infrastructure/state'
import { selectAroma } from '@aroma/infrastructure/selectors'
import { useLayoutFacade } from '@layout/application/facades'

export const useAromaController = () => {
  const dispatch = useAppDispatch()
  const selectedAroma = useAppSelector(selectAroma)

  const { size } = useLayoutFacade()
  const { sizeCard, remSize } = size

  const update = (item: typeof selectedAroma) => {
    dispatch(aromaActions.updateAroma(item))
  }

  const reset = () => {
    dispatch(aromaActions.resetAroma())
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    if (selectedAroma) {
      dispatch(aromaActions.updateAroma(selectedAroma))
      dispatch(setActiveSection('aroma'))
    }
  }

  const isSelected = (id: string) => {
    return selectedAroma?.index === id
  }

  return {
    state: {
      selectedAroma,
    },
    actions: {
      update,
      reset,
      handleSubmit,
      isSelected,
    },
  }
}
