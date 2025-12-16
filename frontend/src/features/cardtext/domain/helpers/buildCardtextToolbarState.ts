import { CARDTEXT_KEYS, type CardtextToolbarState } from '@toolbar/domain/types'
import type { CardtextValue } from '../types'

export const buildCardtextToolbarState = (
  value: CardtextValue
): CardtextToolbarState => {
  const firstBlock = value[0]
  const firstLeaf = firstBlock?.children?.[0] ?? {}

  const state = {} as CardtextToolbarState

  const plainText = value
    .map((block) => block.children.map((ch) => ch.text).join(''))
    .join('')
  const hasContent = plainText.trim().length > 0

  for (const key of CARDTEXT_KEYS) {
    switch (key) {
      case 'italic':
        state.italic = firstLeaf.italic ? 'active' : 'enabled'
        break
      case 'bold':
        state.bold = firstLeaf.bold ? 'active' : 'enabled'
        break
      case 'underline':
        state.underline = firstLeaf.underline ? 'active' : 'enabled'
        break
      case 'fontSize':
        state.fontSize = 'enabled'
        break
      case 'color':
        state.color = 'enabled'
        break
      case 'left':
        state.left = firstBlock.align === 'left' ? 'active' : 'enabled'
        break
      case 'center':
        state.center = firstBlock.align === 'center' ? 'active' : 'enabled'
        break
      case 'right':
        state.right = firstBlock.align === 'right' ? 'active' : 'enabled'
        break
      case 'justify':
        state.justify = firstBlock.align === 'justify' ? 'active' : 'enabled'
        break
      case 'save':
        state.save = hasContent ? 'enabled' : 'disabled'
        break
      case 'remove':
        state.remove = hasContent ? 'enabled' : 'disabled'
        break
      case 'textTemplates':
        state.textTemplates = 'disabled'
        break
      default:
        const exhaustiveCheck: never = key
        throw new Error(`Unhandled key: ${exhaustiveCheck}`)
    }
  }

  return state
}
