import type { CardtextToolbarState } from '@toolbar/domain/types'
import type { CardtextValue } from '../types'

export const buildCardtextToolbarState = (
  value: CardtextValue,
  options?: {
    /** Same template id on asset and appliedData (Apply already on postcard). */
    assetProcessed?: boolean
  },
): CardtextToolbarState => {
  const firstBlock = value[0]
  const state = {} as Partial<CardtextToolbarState>

  const plainText = value
    .map((block) => block.children.map((ch) => ch.text).join(''))
    .join('')
  const hasContent = plainText.trim().length > 0
  const applyMatchesPostcard = options?.assetProcessed === true

  // Keep this helper intentionally small: only derive states
  // that are strictly text-content based.
  state.left = firstBlock?.align === 'left' ? 'active' : 'enabled'
  state.center = firstBlock?.align === 'center' ? 'active' : 'enabled'
  state.right = firstBlock?.align === 'right' ? 'active' : 'enabled'
  state.justify = firstBlock?.align === 'justify' ? 'active' : 'enabled'
  state.apply = applyMatchesPostcard
    ? 'disabled'
    : hasContent
      ? 'enabled'
      : 'disabled'
  state.cardtextCheck = hasContent ? 'enabled' : 'disabled'

  return state as CardtextToolbarState
}
