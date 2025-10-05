import { useEffect } from 'react'
import { computeLayoutSizes } from '../services'
import { useLayoutFacade } from '../facades/useLayoutFasade'

export const useLayoutResize = (
  formRef: React.RefObject<HTMLDivElement | null>,
  formSize?: { width: number; height: number }
) => {
  const { size, actions } = useLayoutFacade()

  useEffect(() => {
    if (formSize && size.remSize && formRef.current) {
      const { cardSize, miniCardSize, maxCardsList } = computeLayoutSizes({
        containerHeight: formSize.height,
        containerWidth: formRef.current.clientWidth,
        remSize: size.remSize,
      })

      actions.setSizeCard(cardSize)
      actions.setSizeMiniCard(miniCardSize)
      actions.setMaxCardsList(maxCardsList)
    }
  }, [formSize, size.remSize])
}
