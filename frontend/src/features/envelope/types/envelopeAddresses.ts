import type { SenderAddress, RecipientAddress } from './baseAddress'
import { initialBaseAddress } from './baseAddress'

export interface EnvelopeAddresses {
  sender: SenderAddress
  recipient: RecipientAddress
}

export const initialSenderAddress: SenderAddress = initialBaseAddress
export const initialRecipientAddress: RecipientAddress = initialBaseAddress
