import type { Template } from '@shared/config/constants'
import type { StoreMap, TemplateStoreMap } from '@db/types'

export type CardEditorTemplateMap = Partial<
  Record<'cardphoto' | 'cardtext' | 'sender' | 'recipient', string>
>

export type TemplateDataMap = {
  stockImages: unknown
  userImages: StoreMap['userImages']
  cardtext: StoreMap['cardtext']
  sender: StoreMap['sender']
  recipient: StoreMap['recipient']
  cart: TemplateStoreMap['cart']
  drafts: TemplateStoreMap['drafts']
}

export type DataFor<T extends Template> = TemplateDataMap[T]
