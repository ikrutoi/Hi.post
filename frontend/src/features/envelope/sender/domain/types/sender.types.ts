import { byKey } from '../../../addressForm/domain/types'
import type { AddressLayout } from '@envelope/addressForm/domain/types'
import type { AddressFields } from '@shared/config/constants'

export const senderLayout: AddressLayout = [
  byKey.name,
  byKey.street,
  [byKey.zip, byKey.city],
  byKey.country,
]

export type SenderView = 'addressFormSenderView' | 'senderView'

export type SenderState = {
  currentView: SenderView
  addressFormData: AddressFields
  addressFormIsComplete: boolean
  senderViewId: string | null
  /** Сохраняем при открытии формы, восстанавливаем при отмене закрытия */
  previousSenderViewId: string | null
  applied: string[]
  enabled: boolean
}
