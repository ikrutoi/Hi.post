import type { AddressFields } from '@shared/config/constants'
import type { ListStatus } from '@entities/envelope/domain/types'

export type AddressSaveRequestedPayload = {
  listStatus?: ListStatus
  viewOnly?: boolean
  /** Snapshot from create-form at click time (applyLight). */
  draft?: AddressFields
}
