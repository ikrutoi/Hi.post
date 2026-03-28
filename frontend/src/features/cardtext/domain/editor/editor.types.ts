import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

// ——— Slate / editor types ———
export type CardtextTextNode = {
  text: string
}

export type CardtextListSortDirection = 'asc' | 'desc'

export type CardtextTemplatesListState = CardtextContent[] | null

export type CardtextStatus = 'draft' | 'processed' | 'outLine' | 'inLine'

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

/** Stable defaults for selectors when `assetData` is null (avoid new references each run). */
export const defaultCardtextStyle: CardtextStyle = {
  fontFamily: 'Roboto',
  fontSizeStep: 3,
  color: 'deepBlack',
  align: 'left',
}

export type CardtextCreateDraft = CardtextContent

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

export function createInitialCardtextContent(): CardtextContent {
  return {
    id: null,
    value: initialCardtextValue.map((b) => ({
      ...b,
      children: b.children.map((c) => ({ ...c })),
    })),
    style: { ...defaultCardtextStyle },
    title: '',
    plainText: '',
    favorite: null,
    timestamp: 0,
    status: 'draft',
    cardtextLines: 15,
  }
}

export interface CardtextState {
  assetData: CardtextContent | null
  presetData: CardtextContent | null
  appliedData: CardtextContent | null
  draftData: CardtextContent | null
  resetToken: number
  isDraftFocus: boolean
  /**
   * After clearing `assetData`, hide `cardtextCreate` until the user clicks the draft
   * surface or uses `cardtextAdd`; then show toolbar and allow programmatic focus.
   */
  isCardtextDraftEngaged: boolean
}

export interface CardtextEditorSessionSnapshot {
  assetData: CardtextContent | null
  presetData: CardtextContent | null
  appliedData: CardtextContent | null
  draftData: CardtextContent | null
}

export type CreateCardtextPayload = Pick<
  CardtextContent,
  'value' | 'style' | 'plainText' | 'cardtextLines'
> & {
  title?: string
  favorite?: boolean | null
  id?: string
  status?: CardtextStatus
}

export type UpdateCardtextPayload = Omit<
  Partial<CardtextContent>,
  'style' | 'timestamp' | 'id'
> & {
  style?: Partial<CardtextStyle>
}

export const initialCardtextEditorState: CardtextState = {
  assetData: null,
  presetData: null,
  appliedData: null,
  draftData: null,
  resetToken: 0,
  isDraftFocus: false,
  isCardtextDraftEngaged: false,
}
