import type { CardtextStyle, CardtextValue } from '@cardtext/domain/types'
import type { TemplateBase, TemplateMetadata } from './template.types'

export interface CardtextTemplate extends TemplateBase, TemplateMetadata {
  value: CardtextValue
  style: CardtextStyle
  title: string
  plainText: string
  cardtextLines: number
  favorite: boolean | null
}

export interface CreateCardtextTemplatePayload {
  value: CardtextValue
  style: CardtextStyle
  plainText: string
  cardtextLines: number
  title?: string
  name?: string
  favorite?: boolean | null
  /** Опционально: свой id (иначе будет сгенерирован nanoid()) */
  id?: string
}

export interface UpdateCardtextTemplatePayload {
  value?: CardtextValue
  style?: Partial<CardtextStyle>
  plainText?: string
  cardtextLines?: number
  title?: string
  name?: string
  favorite?: boolean | null
}
