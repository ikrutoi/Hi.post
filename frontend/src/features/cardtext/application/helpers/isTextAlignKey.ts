import { TEXT_ALIGN_KEYS } from '@toolbar/domain/types'
import type { TextAlignKey } from '@toolbar/domain/types'

export const isTextAlignKey = (key: string): key is TextAlignKey =>
  TEXT_ALIGN_KEYS.includes(key as TextAlignKey)
