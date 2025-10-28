import type { CardtextTextAlignKey } from '@toolbar/domain/types'

export interface CardtextBlock {
  type: 'paragraph'
  children: { text: string }[]
}

export interface MiniCardtextStyle {
  maxLines: number | null
  fontSize: number | null
  lineHeight: number | null
}

type FontStyle = 'normal' | 'italic'
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export interface CardtextState {
  text: CardtextBlock[]
  colorName: string
  colorType: string
  font: string
  fontSize: number
  fontStyle: FontStyle
  fontWeight: FontWeight
  textAlign: CardtextTextAlignKey
  lineHeight: number | null
  miniCardtextStyle: MiniCardtextStyle
}
