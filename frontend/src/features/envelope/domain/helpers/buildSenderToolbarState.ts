import { ENVELOPE_KEYS, type EnvelopeToolbarState } from '@toolbar/domain/types'

export const buildSenderToolbarState = (
  isComplete: boolean,
  hasData: boolean,
): EnvelopeToolbarState => {
  const state = {} as EnvelopeToolbarState

  for (const key of ENVELOPE_KEYS) {
    switch (key) {
      case 'close':
        state.close = hasData ? 'enabled' : 'disabled'
        break
      case 'addressPlus':
        state.addressPlus = isComplete ? 'enabled' : 'disabled'
        break
      case 'addressList':
        state.addressList = 'disabled'
        break
      case 'deleteList':
        state.deleteList = 'disabled'
        break
      default:
        const exhaustiveCheck: never = key
        throw new Error(`Unhandled key: ${exhaustiveCheck}`)
    }
  }

  return state
}
