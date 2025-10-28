import type { CardtextState } from './cardtext.types'

export interface CardtextTemplateItem {
  localId: number
  id: string
  state: CardtextState
  data: string
}
