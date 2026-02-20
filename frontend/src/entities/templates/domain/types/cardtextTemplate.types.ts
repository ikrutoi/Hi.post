import type { TemplateBase, TemplateMetadata } from './template.types'

export interface CardtextTemplate extends TemplateBase, TemplateMetadata {
  value: CardtextValue
  style: CardtextStyle
  plainText: string
  cardtextLines: number
}

export interface CreateCardtextTemplatePayload {
  value: CardtextValue
  style: CardtextStyle
  plainText: string
  cardtextLines: number
  name?: string
  /** Опционально: свой id (иначе будет сгенерирован nanoid()) */
  id?: string
}

export interface UpdateCardtextTemplatePayload {
  value?: CardtextValue
  style?: Partial<CardtextStyle>
  plainText?: string
  cardtextLines?: number
  name?: string
}
