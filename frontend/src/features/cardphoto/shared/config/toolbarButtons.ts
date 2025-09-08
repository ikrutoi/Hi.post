import type { CardphotoButtonsState } from '@features/cardphoto/application/store/cardphotoButtonsSlice'

export type CardToolbarButton = keyof CardphotoButtonsState

export const toolbarButtons: CardToolbarButton[] = [
  'download',
  'save',
  'delete',
  'crop',
  'maximaze',
  'turn',
]
