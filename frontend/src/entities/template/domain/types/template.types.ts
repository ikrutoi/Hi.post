import type { Template } from '@shared/config/constants'
import type { StoreMap, TemplateStoreMap } from '@db/types'

export type CardEditorTemplateMap = Partial<
  Record<'cardphoto' | 'cardtext' | 'sender' | 'recipient', string>
>

export type TemplateDataMap = {
  stockImages: unknown
  editorImages: StoreMap['editorImages']
  cardtext: StoreMap['cardtext']
  sender: StoreMap['sender']
  recipient: StoreMap['recipient']
  cart: TemplateStoreMap['cart']
  drafts: TemplateStoreMap['drafts']
  sent: TemplateStoreMap['sent']
}

export type DataFor<T extends Template> = TemplateDataMap[T]
