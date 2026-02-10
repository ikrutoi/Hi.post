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

// export type CardtextBlock = ParagraphElement | HeadingElement | QuoteElement

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

export type CardtextSessionRecord = CardtextStyle

export interface CardtextStyle {
  fontFamily: string
  fontSizeStep: number
  color: string
  align: TextAlign
}

// export interface CardtextState {
//   value: CardtextValue
//   style: CardtextStyle
// }

export interface CardtextState {
  value: CardtextValue
  style: CardtextStyle
  plainText: string
  isComplete: boolean
  cardtextLines: number
  resetToken: number
}
