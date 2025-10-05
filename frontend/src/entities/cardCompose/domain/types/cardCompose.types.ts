import type { CardphotoState } from '@entities/cardphoto'
import type { CardtextState } from '@entities/cardtext'
import type { EnvelopeState } from '@entities/envelope'
import type { AromaState } from '@entities/aroma'
import type { DateState } from '@entities/date'

export type CardCompose = {
  cardphoto: {
    isComplete: boolean
    data: CardphotoState
  }
  cardtext: {
    isComplete: boolean
    data: CardtextState
  }
  envelope: {
    isComplete: boolean
    data: EnvelopeState
  }
  aroma: { isComplete: boolean; data: AromaState }
  date: { isComplete: boolean; data: DateState }
}
