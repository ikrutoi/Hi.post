import { ENVELOPE_KEYS, type EnvelopeToolbarState } from '@toolbar/domain/types'

export const buildRecipientToolbarState = (
  isComplete: boolean,
  hasData: boolean,
): EnvelopeToolbarState => {
  const state = {} as EnvelopeToolbarState

  for (const key of ENVELOPE_KEYS) {
    switch (key) {
      case 'favorite':
        state.save = isComplete ? 'enabled' : 'disabled'
        break
      case 'close':
        state.close = hasData ? 'enabled' : 'disabled'
        break
      case 'addressTemplates':
        state.addressTemplates = 'disabled'
        break
      default:
        const exhaustiveCheck: never = key
        throw new Error(`Unhandled key: ${exhaustiveCheck}`)
    }
  }

  return state
}
