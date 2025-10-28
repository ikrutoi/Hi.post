import type { AddressKey } from './index'

export interface EnvelopeUiSignals {
  miniAddressClose: AddressKey | null
  envelopeSave: AddressKey | null
  envelopeSaveSecond: boolean | null
  envelopeRemoveAddress: boolean | null
}
