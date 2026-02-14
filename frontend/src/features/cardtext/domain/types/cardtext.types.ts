import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import type { CardtextRecord } from '@db/types'

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

// export type CardtextSessionRecord = {
//   assetId: string | null
//   value: CardtextValue
//   style: CardtextStyle
//   plainText: string
//   cardtextLines: number
// }

export interface CardtextStyle {
  fontFamily: string
  fontSizeStep: number
  color: TextColor
  align: TextAlign
}

// export interface CardtextState {
//   assetId: string | null
//   value: CardtextValue
//   style: CardtextStyle
//   plainText: string
//   isComplete: boolean
//   cardtextLines: number
//   resetToken: number
// }

// export interface CardtextBase {
//   assetId: string | null
//   value: CardtextValue
//   style: CardtextStyle
//   plainText: string
//   cardtextLines: number
// }

export interface CardtextSessionRecord extends Omit<CardtextRecord, 'id'> {
  assetId: string | null
}

export interface CardtextState extends CardtextSessionRecord {
  isComplete: boolean
  resetToken: number
}
