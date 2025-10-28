import { CARDTEXT_TEXT_ALIGN_KEYS } from '@toolbar/domain/types'
import type { CardtextTextAlignKey } from '@toolbar/domain/types'

export const isTextAlignKey = (key: string): key is CardtextTextAlignKey =>
  CARDTEXT_TEXT_ALIGN_KEYS.includes(key as CardtextTextAlignKey)
