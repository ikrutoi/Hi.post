import { useCardphotoToolbarUI } from '../hooks'

import type { SectionsToolbar } from '@shared/config/constants'

export const toolbarUiMap: Partial<
  Record<
    SectionsToolbar,
    (section: SectionsToolbar) => ReturnType<typeof useCardphotoToolbarUI>
  >
> = {
  cardphoto: useCardphotoToolbarUI,
  // cardtext: useCardtextToolbarUI,
}
