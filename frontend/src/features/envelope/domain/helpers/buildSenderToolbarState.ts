import { ENVELOPE_KEYS, type EnvelopeToolbarState } from '@toolbar/domain/types'
import { resolveAddressAddToolbarState } from './resolveAddListToolbarState'

export interface BuildSenderToolbarParams {
  isComplete: boolean
  hasData: boolean
  addressListCount: number
  isCurrentAddressInList: boolean
  hasDraft: boolean
  isAddressFormOpen: boolean
  /** true = форма создания адреса при закрытии была пустой; для индикатора addressAdd */
  formIsEmpty: boolean
  /** formDraft заполнен полностью */
  formIsComplete: boolean
  /** список адресов отправителя открыт — иконка addressList в active */
  senderListPanelOpen?: boolean
  /** View показывает адрес из create-черновика */
  viewingFormDraftAddress?: boolean
  /** Отправитель выключен тумблером — иконки toolbar disabled, кроме addressAdd */
  isEnabled?: boolean
}

export const buildSenderToolbarState = ({
  isComplete,
  hasData,
  addressListCount,
  isCurrentAddressInList,
  hasDraft,
  isAddressFormOpen,
  formIsEmpty,
  formIsComplete,
  senderListPanelOpen = false,
  viewingFormDraftAddress = false,
  isEnabled = true,
}: BuildSenderToolbarParams): EnvelopeToolbarState => {
  const state = {} as EnvelopeToolbarState

  for (const key of ENVELOPE_KEYS) {
    switch (key) {
      // case 'close':
      //   state.close = hasData ? 'enabled' : 'disabled'
      //   break
      case 'addressAdd':
        state.addressAdd = resolveAddressAddToolbarState({
          isAddressFormOpen,
          formIsEmpty,
          formIsComplete,
          viewingFormDraftAddress,
        })
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
          state: isAddressFormOpen
            ? 'disabled'
            : isComplete
              ? 'enabled'
              : 'disabled',
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

  if (!isEnabled) {
    for (const key of ENVELOPE_KEYS) {
      if (key === 'addressAdd') continue
      const value = state[key]
      state[key] =
        value != null && typeof value === 'object' && 'state' in value
          ? {
              ...value,
              state: 'disabled' as const,
              options: {
                ...(value.options ?? {}),
                badge: null,
                badgeDot: false,
              },
            }
          : ('disabled' as const)
    }
  }

  return state
}
