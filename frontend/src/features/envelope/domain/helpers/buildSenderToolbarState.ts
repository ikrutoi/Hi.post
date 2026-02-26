import { ENVELOPE_KEYS, type EnvelopeToolbarState } from '@toolbar/domain/types'

export interface BuildSenderToolbarParams {
  isComplete: boolean
  hasData: boolean
  addressListCount: number
  isCurrentAddressInList: boolean
  isCurrentAddressFavorite: boolean
}

export const buildSenderToolbarState = ({
  isComplete,
  hasData,
  addressListCount,
  isCurrentAddressInList,
  isCurrentAddressFavorite,
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
          options: {
            badge: addressListCount > 0 ? addressListCount : null,
          },
        }
        break
      case 'apply':
        state.apply = {
          state: isComplete ? 'enabled' : 'disabled',
          options: {},
        }
        break
      case 'listAdd':
        state.listAdd = 'enabled'
        break
      // case 'favorite':
      //   state.favorite = !isComplete
      //     ? 'disabled'
      //     : isCurrentAddressFavorite
      //       ? 'active'
      //       : 'enabled'
      //   break
      // case 'empty':
      //   state.empty = 'disabled'
      //   break
      default:
        const exhaustiveCheck: never = key
        throw new Error(`Unhandled key: ${exhaustiveCheck}`)
    }
  }

  return state
}
