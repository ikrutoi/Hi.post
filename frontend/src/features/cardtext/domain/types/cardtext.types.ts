import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type CardtextTextNode = {
  text: string
  // italic?: boolean
  // bold?: boolean
  // underline?: boolean
  // fontSize?: number
  // color?: string
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

export type MarkFormat = 'bold' | 'italic' | 'underline'

// export interface CardtextState {
//   value: CardtextValue
//   plainText: string
//   isComplete: boolean
// }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CardtextBlock
    Text: CardtextTextNode
  }
}

export const initialCardtextValue: CardtextValue = [
  {
    type: 'paragraph',
    align: 'left',
    children: [{ text: '' }],
  },
]

export interface CardtextStyle {
  fontFamily: string
  fontSizeStep: number
  color: TextColor
  align: TextAlign
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

export interface CardtextTemplateItem {
  id: string
  state: CardtextTemplateContent
}

export interface CardtextState extends CardtextTemplateContent {
  currentTemplateId: string | null
  isComplete: boolean
  resetToken: number
}

export type CardtextRecord = CardtextTemplateContent & { id: string }
