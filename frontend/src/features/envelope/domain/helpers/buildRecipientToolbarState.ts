import { ENVELOPE_KEYS, type EnvelopeToolbarState } from '@toolbar/domain/types'

export const buildRecipientToolbarState = (
  isComplete: boolean,
  hasData: boolean
): EnvelopeToolbarState => {
  const state = {} as EnvelopeToolbarState

  for (const key of ENVELOPE_KEYS) {
    switch (key) {
      case 'save':
        state.save = isComplete ? 'enabled' : 'disabled'
        break
      case 'remove':
        state.remove = hasData ? 'enabled' : 'disabled'
        break
      case 'cardUser':
        state.cardUser = 'disabled'
        break
      default:
        const exhaustiveCheck: never = key
        throw new Error(`Unhandled key: ${exhaustiveCheck}`)
    }
  }

  return state
}
