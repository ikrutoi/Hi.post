import { ENVELOPE_KEYS, type EnvelopeToolbarState } from '@toolbar/domain/types'

export const buildSenderToolbarState = (
  isComplete: boolean,
  hasData: boolean
): EnvelopeToolbarState => {
  const state = {} as EnvelopeToolbarState

  for (const key of ENVELOPE_KEYS) {
    switch (key) {
      case 'save':
        state.save = isComplete ? 'enabled' : 'disabled'
        break
      case 'delete':
        state.delete = hasData ? 'enabled' : 'disabled'
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
