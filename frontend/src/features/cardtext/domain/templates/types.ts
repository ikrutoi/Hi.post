import type {
  CardtextValue,
  CardtextStyle,
  CardtextTemplateContent,
} from '../editor/types'

// ——— Template DTOs (list item, API) ———
export interface CardtextTemplateItem {
  id: string
  localId: number
  state: CardtextTemplateContent
}

export interface CardtextTemplate {
  id: string
  localId: number
  value: CardtextValue
  style: CardtextStyle
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
  value: CardtextValue
  style: CardtextStyle
  plainText: string
  cardtextLines: number
  title?: string
  name?: string
  favorite?: boolean | null
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

// ——— Templates list & UI ———
/** null = не загружено / идёт загрузка (ленивая загрузка без отдельного флага). */
export type CardtextTemplatesListState = CardtextTemplate[] | null

export interface CardtextTemplatesUIState {
  isListPanelOpen: boolean
  isAddTemplateOpen: boolean
}

export const initialCardtextTemplatesState: CardtextTemplatesUIState & {
  templatesList: CardtextTemplatesListState
} = {
  isListPanelOpen: false,
  isAddTemplateOpen: false,
  templatesList: null,
}
