import { useEffect } from 'react'
import type { RefObject } from 'react'
import { changeIconStyles } from '@cardPanel/domain/logic/changeIconStyles'

export function useMinimizeIcons(
  minimize: boolean,
  showIconsMinimize: boolean,
  btnsFullCard: { fullCard: Record<string, boolean> },
  btnIconRefs: RefObject<Record<string, HTMLButtonElement | null>>
) {
  useEffect(() => {
    if (minimize && showIconsMinimize) {
      changeIconStyles(btnsFullCard, btnIconRefs.current)
    }
  }, [minimize, showIconsMinimize, btnsFullCard])
}
