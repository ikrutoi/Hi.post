import { useLayoutFacade } from '@layout/application/facades'
import { useAromaController } from '../controllers'

export const useAromaFacade = () => {
  const { state, actions } = useAromaController()
  const { selectedAroma } = state
  const { size } = useLayoutFacade()
  const { sizeCard, remSize } = size

  const tileSize =
    remSize !== null
      ? {
          height: (sizeCard.height - 6 * remSize) / 4,
          width: (sizeCard.width - 6 * remSize) / 4,
        }
      : null

  return {
    state: {
      selectedAroma,
      tileSize,
    },
    actions,
  }
}
