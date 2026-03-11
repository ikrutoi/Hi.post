import type { AddressFields, EnvelopeRole } from '@shared/config/constants'
import type { RecipientState, SenderState } from '@envelope/domain/types'

export type ListStatus = 'outList' | 'inList'

export interface AddressTemplateItem {
  id: string
  localId: number
  address: AddressFields
  listStatus: ListStatus
  favorite: boolean | null
}

export type AddressRole = EnvelopeRole

export const emptyEnvelope = {
  sender: {
    currentView: 'addressFormSenderView' as const,
    formDraft: {
      name: '',
      street: '',
      zip: '',
      city: '',
      country: '',
    } as AddressFields,
    viewDraft: {
      name: '',
      street: '',
      zip: '',
      city: '',
      country: '',
    } as AddressFields,
    formIsComplete: false,
    formIsEmpty: true,
    sortOptions: { sortedBy: 'name', direction: 'asc' },
    senderViewId: null,
    applied: [],
    enabled: true,
  } as SenderState,
  recipient: {
    currentView: 'addressFormRecipientView' as const,
    formDraft: {
      name: '',
      street: '',
      zip: '',
      city: '',
      country: '',
    } as AddressFields,
    viewDraft: {
      name: '',
      street: '',
      zip: '',
      city: '',
      country: '',
    } as AddressFields,
    formIsComplete: false,
    formIsEmpty: true,
    sortOptions: { sortedBy: 'name', direction: 'asc' },
    recipientViewId: null,
    recipientsViewSortDirection: 'asc',
    recipientsViewIdsFirstList: [],
    recipientsViewIdsSecondList: [],
    currentRecipientsList: 'first',
    applied: [],
    appliedData: null,
    mode: 'recipient',
  } as RecipientState,
}
