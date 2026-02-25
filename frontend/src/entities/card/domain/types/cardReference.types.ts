import type { CardStatus } from './card.types'
import type { AromaImageIndex } from '@entities/aroma/domain/types'
import type { DispatchDate } from '@entities/date'

/** Рабочий макет открытки (до «положить в корзину»): id секций + массив получателей. Хранится в БД. */
export interface WorkingCardRecord {
  id: string
  cardphotoId: string | null
  cardtextId: string | null
  aromaId: AromaImageIndex
  date: DispatchDate
  senderId: string | null
  /** Id шаблонов получателей из БД; одиночный режим = массив из одного элемента */
  recipientIds: string[]
  /** Ссылка на превью картинки для пирога секций и списков */
  cardphotoPreviewUrl: string | null
  updatedAt: number
}

export interface CardTemplateReferences {
  cardphotoId: string | null
  cardtextId: string | null
  recipientId: string | null
  senderId: string | null
}

export interface CardPreview {
  cardphotoPreview?: string
  cardtextPreview?: string
  recipientPreview?: string
  senderPreview?: string
  aromaPreview?: string
  datePreview?: string
}

export interface PhotoUsage {
  photoId: string
  photoOwnerId: string
  tokensCost: number
}

export interface CardMeta {
  price?: string
  createdAt: number
  updatedAt: number
}

export type ReplicaGroupId = string | null

export interface CardReference {
  id: string
  userId: string
  status: CardStatus

  templates: CardTemplateReferences

  aromaId: AromaImageIndex
  date: DispatchDate

  thumbnailUrl: string
  preview: CardPreview

  meta: CardMeta

  photoUsage?: PhotoUsage[]

  replicaGroupId?: ReplicaGroupId
}

export interface CardListItem {
  id: string
  status: CardStatus
  thumbnailUrl: string
  date: DispatchDate
  preview?: Partial<CardPreview>
}
