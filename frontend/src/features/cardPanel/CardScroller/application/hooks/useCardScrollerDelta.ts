import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { metaController } from '@features/layout/application/controllers'

export const useCardScrollerDelta = (
  totalCards: number,
  index: number,
  maxCards: number
) => {
  const dispatch = useAppDispatch()
  const { setDeltaEnd } = metaController(dispatch)

  useEffect(() => {
    if (totalCards && index >= 0 && maxCards) {
      const delta = totalCards - index
      setDeltaEnd(delta)
    }
  }, [totalCards, index, maxCards])
}
