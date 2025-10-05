import { useCallback } from 'react'
import { useLayoutFacade } from '../facades/useLayoutFasade'

export const useToolbarClickReset = (
  colorToolbar: boolean | null,
  setColorToolbar: (v: boolean) => void
) => {
  const { actions } = useLayoutFacade()

  return useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      const target = evt.target as HTMLElement

      if (
        colorToolbar &&
        !target.classList.contains('toolbar-color') &&
        !target.classList.contains('toolbar-more')
      ) {
        setColorToolbar(false)
        actions.setButtonToolbar({
          firstBtn: '',
          secondBtn: '',
          section: '',
        })
      }
    },
    [colorToolbar, setColorToolbar, actions.setButtonToolbar]
  )
}
