import { ENVELOPE_KEYS, type EnvelopeToolbarState } from '@toolbar/domain/types'

export interface BuildSenderToolbarParams {
  isComplete: boolean
  hasData: boolean
  addressListCount: number
  isCurrentAddressInList: boolean
}

export const buildSenderToolbarState = ({
  isComplete,
  hasData,
  addressListCount,
  isCurrentAddressInList,
}: BuildSenderToolbarParams): EnvelopeToolbarState => {
  const state = {} as EnvelopeToolbarState

  for (const key of ENVELOPE_KEYS) {
    switch (key) {
      case 'close':
        state.close = hasData ? 'enabled' : 'disabled'
        break
      case 'addressPlus':
        state.addressPlus =
          isComplete && !isCurrentAddressInList ? 'enabled' : 'disabled'
        break
      case 'addressList':
        state.addressList = {
          state: addressListCount > 0 ? 'enabled' : 'disabled',
        }
        break
      case 'deleteList':
        state.deleteList = addressListCount > 0 ? 'enabled' : 'disabled'
        break
      default:
        const exhaustiveCheck: never = key
        throw new Error(`Unhandled key: ${exhaustiveCheck}`)
    }
  }

  return state
}
