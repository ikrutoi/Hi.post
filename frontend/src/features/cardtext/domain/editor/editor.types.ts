import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

// ——— Slate / editor types ———
export type CardtextTextNode = {
  text: string
}

export type CardtextListSortDirection = 'asc' | 'desc'

export type CardtextTemplatesListState = CardtextContent[] | null

export type CardtextStatus = 'draft' | 'processed' | 'outLine' | 'inLine'

export const CARDTEXT_APPLIED_DISPLAY_STATUSES: ReadonlySet<CardtextStatus> =
  new Set(['processed', 'inLine', 'outLine'])

export const CARDTEXT_POSTCARD_LOCKED_STATUSES: ReadonlySet<CardtextStatus> =
  new Set(['inLine', 'outLine'])

export type TextAlign = 'left' | 'center' | 'right' | 'justify'

export const TEXT_COLOR = [
  'deepBlack',
  'blue',
  'burgundy',
  'forestGreen',
] as const

/** 6 шагов — плавнее прежнего [16,18,22,28,36,48]. */
export const STEP_TO_PX = [14, 16, 18, 20, 23, 26] as const

export const CARDTEXT_FONT_SIZE_STEP_MIN = 1
export const CARDTEXT_FONT_SIZE_STEP_MAX = STEP_TO_PX.length

export function clampCardtextFontSizeStep(step: number): number {
  return Math.min(
    CARDTEXT_FONT_SIZE_STEP_MAX,
    Math.max(CARDTEXT_FONT_SIZE_STEP_MIN, Math.round(step)),
  )
}

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

/** Рекурсивно: в сохранённых/серверных value иногда вложенные element-узлы, а не только `CardtextTextNode` в `children` блока. */
function slateSubtreeHasNonEmptyText(node: unknown): boolean {
  if (node == null || typeof node !== 'object') return false
  const n = node as { text?: unknown; children?: unknown }
  if (typeof n.text === 'string' && n.text.trim().length > 0) return true
  if (!Array.isArray(n.children)) return false
  return n.children.some(slateSubtreeHasNonEmptyText)
}

/** Для превью / зеркала списка: есть текст в plainText или в узлах value (в т.ч. draft без applied). */
export function cardtextHasRenderableContent(
  ct: CardtextContent | null | undefined,
): boolean {
  if (ct == null) return false
  if ((ct.plainText?.trim?.() ?? '').length > 0) return true
  for (const block of ct.value ?? []) {
    if (slateSubtreeHasNonEmptyText(block)) return true
  }
  return false
}

/**
 * Значение для read-only Slate (мини-секция, зеркало списка): если в `value` нет текста,
 * но `plainText` непустой — строим параграфы (иначе превью пустое при сохранённом plainText).
 */
export function cardtextValueForReadOnlyPreview(ct: CardtextContent): CardtextValue {
  const rawBlocks = ct.value ?? []
  for (const block of rawBlocks) {
    if (slateSubtreeHasNonEmptyText(block)) {
      return JSON.parse(JSON.stringify(rawBlocks)) as CardtextValue
    }
  }
  const plain = ct.plainText?.trim() ?? ''
  if (plain.length > 0) {
    const align = (ct.style?.align ?? 'left') as TextAlign
    return plain.split('\n').map((line) => ({
      type: 'paragraph' as const,
      align,
      children: [{ text: line }],
    }))
  }
  if (rawBlocks.length > 0) {
    return JSON.parse(JSON.stringify(rawBlocks)) as CardtextValue
  }
  return initialCardtextValue.map((b) => ({
    ...b,
    children: b.children.map((c) => ({ ...c })),
  }))
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
  /** Снимок Processed перед просмотром шаблона в View; восстанавливается по Close в View. */
  processedSlotBackup: CardtextContent | null
  resetToken: number
  isDraftFocus: boolean
  isDraftEngaged: boolean
  isCardtextViewEditMode: boolean
}

export interface CardtextEditorSessionSnapshot {
  assetData: CardtextContent | null
  presetData: CardtextContent | null
  appliedData: CardtextContent | null
  draftData: CardtextContent | null
  isCardtextViewEditMode?: boolean
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
  processedSlotBackup: null,
  resetToken: 0,
  isDraftFocus: false,
  isDraftEngaged: false,
  isCardtextViewEditMode: false,
}
