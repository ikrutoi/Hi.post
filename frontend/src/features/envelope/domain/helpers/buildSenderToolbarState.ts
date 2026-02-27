import { ENVELOPE_KEYS, type EnvelopeToolbarState } from '@toolbar/domain/types'

export interface BuildSenderToolbarParams {
  isComplete: boolean
  hasData: boolean
  addressListCount: number
  isCurrentAddressInList: boolean
  isCurrentAddressFavorite: boolean
  hasDraft: boolean
}

export const buildSenderToolbarState = ({
  isComplete,
  hasData,
  addressListCount,
  isCurrentAddressInList,
  isCurrentAddressFavorite,
  hasDraft,
}: BuildSenderToolbarParams): EnvelopeToolbarState => {
  const state = {} as EnvelopeToolbarState

  for (const key of ENVELOPE_KEYS) {
    switch (key) {
      case 'close':
        state.close = hasData ? 'enabled' : 'disabled'
        break
      case 'addressPlus':
        state.addressPlus = {
          state: 'enabled',
          options: hasDraft ? { badgeDot: true } : { badgeDot: false },
        }
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
        // Enabled только при заполненных полях и если адреса ещё нет в списке:
        // сохраняет в шаблоны и присваивает id
        state.listAdd =
          isComplete && !isCurrentAddressInList ? 'enabled' : 'disabled'
        break
      case 'listClose':
        state.listClose = 'enabled'
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
