import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

// ——— Slate / editor types ———
export type CardtextTextNode = {
  text: string
}

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

export interface CardtextAppliedData {
  value: CardtextValue
  style: CardtextStyle
}

export type CardtextCreateDraft = Pick<
  CardtextTemplateContent,
  'value' | 'style' | 'plainText' | 'cardtextLines'
>

export type CardtextCreateReturnSnapshot = CardtextTemplateContent & {
  assetId: string | null
  isComplete: boolean
  appliedData: CardtextAppliedData | null
}

export interface CardtextTemplateContent {
  value: CardtextValue
  title: string
  style: CardtextStyle
  plainText: string
  cardtextLines: number
  applied: string | null
  favorite: boolean | null
}

export interface CardtextState extends CardtextTemplateContent {
  assetId: string | null
  appliedData: CardtextAppliedData | null
  isComplete: boolean
  resetToken: number
}

export type CardtextCurrentView = 'cardtextView' | 'cardtextEditor'

export interface CardtextEditorUIState {
  currentView: CardtextCurrentView
  requestCardtextFocus: boolean
  createDraft: CardtextCreateDraft | null
  createReturnSnapshot: CardtextCreateReturnSnapshot | null
}

export const initialCardtextEditorState: CardtextState & CardtextEditorUIState =
  {
    assetId: null,
    value: initialCardtextValue,
    style: {
      fontFamily: 'Roboto',
      fontSizeStep: 3,
      color: 'deepBlack',
      align: 'left',
    },
    title: '',
    plainText: '',
    applied: null,
    appliedData: null,
    favorite: null,
    isComplete: false,
    cardtextLines: 15,
    resetToken: 0,
    currentView: 'cardtextEditor',
    requestCardtextFocus: false,
    createDraft: null,
    createReturnSnapshot: null,
  }
