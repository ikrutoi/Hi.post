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
  /** Черновик формы (addressFormSenderView) */
  formDraft: AddressFields
  /** Данные для просмотра/редактирования выбранного шаблона (senderView) */
  viewDraft: AddressFields
  formIsComplete: boolean
  /** true = черновик формы пустой (при выходе из addressForm); для индикатора addressAdd */
  formIsEmpty: boolean
  senderViewId: string | null
  applied: string[]
  enabled: boolean
}
