import type { CardtextValue } from '../editor/types'

export function isEmptyCardtextValue(value: CardtextValue): boolean {
  if (!value?.length) return true
  if (value.length > 1) return false
  const block = value[0]
  const text =
    block?.children?.map((c) => (c as { text?: string }).text).join('') ?? ''
  return text.trim() === ''
}
