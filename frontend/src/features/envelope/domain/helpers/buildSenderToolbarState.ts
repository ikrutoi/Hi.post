import { ENVELOPE_KEYS, type EnvelopeToolbarState } from '@toolbar/domain/types'

export interface BuildSenderToolbarParams {
  isComplete: boolean
  hasData: boolean
  addressListCount: number
  isCurrentAddressInList: boolean
  isCurrentAddressFavorite: boolean
  hasDraft: boolean
  isAddressFormOpen: boolean
  /** true = форма создания адреса при закрытии была пустой; для индикатора addressAdd */
  formIsEmpty: boolean
  /** список адресов отправителя открыт — иконка addressList в active */
  senderListPanelOpen?: boolean
}

export const buildSenderToolbarState = ({
  isComplete,
  hasData,
  addressListCount,
  isCurrentAddressInList,
  isCurrentAddressFavorite,
  hasDraft,
  isAddressFormOpen,
  formIsEmpty,
  senderListPanelOpen = false,
}: BuildSenderToolbarParams): EnvelopeToolbarState => {
  const state = {} as EnvelopeToolbarState

  for (const key of ENVELOPE_KEYS) {
    switch (key) {
      // case 'close':
      //   state.close = hasData ? 'enabled' : 'disabled'
      //   break
      case 'addressAdd':
        state.addressAdd = isAddressFormOpen
          ? { state: 'disabled', options: { badgeDot: false } }
          : { state: 'enabled', options: { badgeDot: !formIsEmpty } }
        break
      case 'addressList':
        state.addressList = {
          state: senderListPanelOpen ? 'active' : 'enabled',
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
        state.listAdd =
          isComplete && !isCurrentAddressInList ? 'enabled' : 'disabled'
        break
      // case 'listClose':
      //   state.listClose = 'enabled'
      //   break
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
