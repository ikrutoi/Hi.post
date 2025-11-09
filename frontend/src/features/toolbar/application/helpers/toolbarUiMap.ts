import { useCardphotoToolbarUI, useCardPanelOverlayToolbarUI } from '../hooks'

import type { ToolbarSection } from '@toolbar/domain/types'

export const toolbarUiMap: Partial<
  Record<
    ToolbarSection,
    (section: ToolbarSection) => ReturnType<typeof useCardphotoToolbarUI>
  >
> = {
  cardphoto: useCardphotoToolbarUI,
  cardPanelOverlay: useCardPanelOverlayToolbarUI,
}
