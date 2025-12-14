import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type CardtextTextNode = {
  text: string
  italic?: boolean
  bold?: boolean
  underline?: boolean
  fontSize?: number
  color?: string
}

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

export type CardtextBlock = ParagraphElement | HeadingElement | QuoteElement

export type CardtextValue = CardtextBlock[]
// export type CardtextValue = Descendant[]

export type MarkFormat = 'bold' | 'italic' | 'underline'

export interface CardtextState {
  value: CardtextValue
  plainText: string
  isComplete: boolean
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CardtextBlock
    Text: CardtextTextNode
  }
}
