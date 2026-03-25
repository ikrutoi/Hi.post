import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

// ——— Slate / editor types ———
export type CardtextTextNode = {
  text: string
}

export type CardtextListSortDirection = 'asc' | 'desc'

export type CardtextTemplatesListState = CardtextContent[] | null

export type CardtextStatus = 'processed' | 'outLine' | 'inLine'

export type TextAlign = 'left' | 'center' | 'right' | 'justify'

export const TEXT_COLOR = [
  'deepBlack',
  'blue',
  'burgundy',
  'forestGreen',
] as const

export const STEP_TO_PX = [16, 18, 22, 28, 36, 48]

export type TextColor = (typeof TEXT_COLOR)[number]

export type ParagraphElement = {
  type: 'paragraph'
  align?: 'left' | 'center' | 'right' | 'justify'
  children: CardtextTextNode[]
}

export type HeadingElement = {
  type: 'heading'
  align?: 'left' | 'center' | 'right' | 'justify'
  children: CardtextTextNode[]
}

export type QuoteElement = {
  type: 'quote'
  align?: 'left' | 'center' | 'right' | 'justify'
  children: CardtextTextNode[]
}

export type CardtextBlock = {
  type: 'paragraph' | 'heading' | 'quote'
  align: TextAlign
  children: CardtextTextNode[]
}

export type CardtextValue = CardtextBlock[]

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CardtextBlock
    Text: CardtextTextNode
  }
}

export const initialCardtextValue: CardtextValue = [
  { type: 'paragraph', align: 'left', children: [{ text: '' }] },
]

export interface CardtextStyle {
  fontFamily: string
  fontSizeStep: number
  color: TextColor
  align: TextAlign
}

export type CardtextCreateDraft = Pick<
  CardtextContent,
  'value' | 'style' | 'plainText' | 'cardtextLines' | 'timestamp'
>

export type CardtextCreateReturnSnapshot = CardtextContent

export interface CardtextContent {
  id: string | null
  status: CardtextStatus
  value: CardtextValue
  title: string
  style: CardtextStyle
  plainText: string
  cardtextLines: number
  favorite: boolean | null
  timestamp: number
}

/** Стартовое содержимое слоя `assetData` (редактор / сохранённая сессия). */
export function createInitialCardtextContent(): CardtextContent {
  return {
    id: null,
    value: initialCardtextValue.map((b) => ({
      ...b,
      children: b.children.map((c) => ({ ...c })),
    })),
    style: {
      fontFamily: 'Roboto',
      fontSizeStep: 3,
      color: 'deepBlack',
      align: 'left',
    },
    title: '',
    plainText: '',
    favorite: null,
    timestamp: 0,
    status: 'inLine',
    cardtextLines: 15,
  }
}

export interface CardtextState {
  assetData: CardtextContent | null
  appendedData: CardtextContent | null
  createDraft: CardtextCreateDraft | null
  resetToken: number
}

export type CreateCardtextPayload = Pick<
  CardtextContent,
  'value' | 'style' | 'plainText' | 'cardtextLines'
> & {
  title?: string
  favorite?: boolean | null
  id?: string
}

export type UpdateCardtextPayload = Omit<
  Partial<CardtextContent>,
  'style' | 'timestamp' | 'status' | 'id'
> & {
  style?: Partial<CardtextStyle>
}

export type CardtextCurrentView = 'cardtextView' | 'cardtextEditor'

export interface CardtextEditorUIState {
  currentView: CardtextCurrentView
  requestCardtextFocus: boolean
  createReturnSnapshot: CardtextCreateReturnSnapshot | null
}

export const initialCardtextEditorState: CardtextState & CardtextEditorUIState =
  {
    assetData: createInitialCardtextContent(),
    appendedData: null,
    createDraft: null,
    resetToken: 0,
    currentView: 'cardtextEditor',
    requestCardtextFocus: false,
    createReturnSnapshot: null,
  }
