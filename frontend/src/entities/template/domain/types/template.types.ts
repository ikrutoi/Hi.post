// @entities/template/types.ts
import type { Template } from '@shared/config/constants'
import type { StoreMap } from '@/db/types'

export type TemplateDataMap = {
  stockImages: unknown
  useImages: StoreMap['userImages']
  cardtext: StoreMap['cardtext']
  sender: StoreMap['sender']
  recipient: StoreMap['recipient']
  cart: StoreMap['cart']
  drafts: StoreMap['drafts']
  sent: StoreMap['sent']
}

export type DataFor<T extends Template> = TemplateDataMap[T]
