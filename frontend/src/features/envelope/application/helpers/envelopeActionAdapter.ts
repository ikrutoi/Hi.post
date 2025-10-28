import type { EnvelopeToolbarKey } from '@toolbar/domain/types'
import type { AddressRole } from '@entities/envelope/domain/types'
import type { MouseEvent } from 'react'

export const createHandleAddressActionAdapter = (
  handleAction: (action: EnvelopeToolbarKey, role: AddressRole) => Promise<void>
) => {
  return async (
    e: MouseEvent<HTMLButtonElement>,
    role: AddressRole
  ): Promise<void> => {
    const action = e.currentTarget.dataset.tooltip as EnvelopeToolbarKey
    if (!action) return

    await handleAction(action, role)
  }
}
