import { CARDPHOTO_KEYS, CARDTEXT_KEYS, ENVELOPE_KEYS } from '../types'
import type { ToolbarSection } from '../types'

export const TOOLBAR_KEYS_MAP: Record<ToolbarSection, readonly string[]> = {
  cardphoto: CARDPHOTO_KEYS,
  cardtext: CARDTEXT_KEYS,
  envelope: ENVELOPE_KEYS,
}
