import type { CardtextContent } from '../editor/editor.types'
import { isEmptyCardtextValue } from './isEmptyCardtextValue'

/** True when nothing worth persisting as `draftData` (store `null` instead). */
export function isCardtextDraftContentEmpty(
  c: CardtextContent | null | undefined,
): boolean {
  if (c == null) return true
  return isEmptyCardtextValue(c.value ?? [])
}
