// @toolbar/domain/constants/toolbarKeysMap.ts
import { CARDPHOTO_KEYS, CARDTEXT_KEYS, ENVELOPE_KEYS } from '../types'
import type { CardSectionName } from '@shared/types'

export const TOOLBAR_KEYS_MAP: Record<CardSectionName, readonly string[]> = {
  cardphoto: CARDPHOTO_KEYS,
  cardtext: CARDTEXT_KEYS,
  envelope: ENVELOPE_KEYS,
}
