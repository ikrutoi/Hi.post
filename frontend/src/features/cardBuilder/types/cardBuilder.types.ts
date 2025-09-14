import type { Address } from '@features/envelope/domain/types'
import type { CardtextState } from '@features/cardtext/domain/types'

export interface CardBuilderState {
  aroma: string | null
  date: string | null
  cardphoto: {
    url: string | null
    source: string | null
  }
  cardtext: CardtextState
  envelope: {
    sender: Address
    recipient: Address
  }
}
