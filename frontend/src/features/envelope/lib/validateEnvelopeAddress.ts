import type { EnvelopeAddresses, AddressRole } from '@features/envelope/types'

export function validateEnvelopeAddresses(
  addresses: EnvelopeAddresses
): Record<AddressRole, boolean> {
  return {
    sender: !!addresses.sender.city && !!addresses.sender.street,
    recipient: !!addresses.recipient.city && !!addresses.recipient.street,
  }
}
