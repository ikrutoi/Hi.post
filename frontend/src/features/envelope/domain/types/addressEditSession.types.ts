import type { AddressFields } from '@shared/config/constants'

/** Временная сессия правки шаблона адреса (с `templateId`), не черновик создания. */
export type AddressEditSession = {
  role: 'sender' | 'recipient'
  templateId: string
  draft: AddressFields
  /** Кого показывать на карточке в режиме просмотра после выхода из edit. */
  displayTemplateIdAtStart: string | null
}

/** Mobile: create-форма с подставленными данными существующего шаблона. */
export type AddressCreateEditContext = {
  role: 'sender' | 'recipient'
  templateId: string
}
