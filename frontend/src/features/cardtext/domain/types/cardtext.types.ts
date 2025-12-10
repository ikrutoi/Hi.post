import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { Descendant } from 'slate'

export type CardtextText = {
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
  children: CardtextText[]
}

export type CardtextBlock = ParagraphElement

export type CardtextValue = Descendant[]

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: ParagraphElement
    Text: CardtextText
  }
}
