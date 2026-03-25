export interface CardtextStyleShape {
  fontFamily: string
  fontSizeStep: number
  color: string
  align: string
}

export interface CardtextTemplateContentShape {
  value: unknown[]
  title: string
  style: CardtextStyleShape
  plainText: string
  cardtextLines: number
  applied: null
  favorite: boolean | null
}

export type CardtextTemplateStatus = 'processed' | 'outLine' | 'inLine'

export interface CardtextTemplateItemShape {
  id: string
  state: CardtextTemplateContentShape
  status?: CardtextTemplateStatus
  createdAt?: number
  updatedAt?: number
}

export interface CardtextTemplate {
  id: string
  value: unknown[]
  style: CardtextStyleShape
  title: string
  plainText: string
  cardtextLines: number
  favorite: boolean | null
  createdAt?: number
  updatedAt?: number
  serverId?: string | null
  syncedAt?: number | null
  isDirty?: boolean
}

export interface CreateCardtextTemplatePayload {
  value: unknown[]
  style: CardtextStyleShape
  plainText: string
  cardtextLines: number
  title?: string
  name?: string
  favorite?: boolean | null
  id?: string
}

export interface UpdateCardtextTemplatePayload {
  value?: unknown[]
  style?: Partial<CardtextStyleShape>
  plainText?: string
  cardtextLines?: number
  title?: string
  name?: string
  favorite?: boolean | null
}
