import type { AddressFields, EnvelopeRole } from '@shared/config/constants'
import type { RecipientState, SenderState } from '@envelope/domain/types'

/**
 * Тип для хранения адреса в IndexedDB
 * Используется в адаптерах recipientTemplatesAdapter и senderTemplatesAdapter
 */
export interface AddressTemplateItem {
  /** Уникальный идентификатор (nanoid или число) */
  id: string
  /** Локальный числовой идентификатор для совместимости */
  localId: number
  /** Данные адреса */
  address: AddressFields
}

/**
 * Тип роли адреса (алиас для EnvelopeRole)
 */
export type AddressRole = EnvelopeRole

/**
 * Пустой конверт для сброса состояния
 */
export const emptyEnvelope = {
  sender: {
    currentView: 'addressFormSenderView' as const,
    addressFormData: {
      name: '',
      street: '',
      zip: '',
      city: '',
      country: '',
    } as AddressFields,
    addressFormIsComplete: false,
    senderViewId: null,
    applied: [],
    enabled: true,
  } as SenderState,
  recipient: {
    currentView: 'addressFormRecipientView' as const,
    addressFormData: {
      name: '',
      street: '',
      zip: '',
      city: '',
      country: '',
    } as AddressFields,
    addressFormIsComplete: false,
    recipientViewId: null,
    recipientsViewIds: [],
    applied: [],
    enabled: false,
  } as RecipientState,
}
