import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { getAddressLabelLayout } from '@i18n/index'
import { DEFAULT_LANG } from '@i18n/langs'
import type { Lang } from '@i18n/langs'
import type { RootState } from '@app/state'
import type {
  EnvelopeAddresses,
  AddressLabelLayout,
} from '@envelope/domain/types'
import { initialEnvelopeAddresses } from '@envelope/domain/models/address.model'

interface UseMiniEnvelopeResult {
  sender: EnvelopeAddresses['sender']
  recipient: EnvelopeAddresses['recipient']
  senderLabels: AddressLabelLayout
  recipientLabels: AddressLabelLayout
}

export const useMiniEnvelope = (
  lang: Lang = DEFAULT_LANG
): UseMiniEnvelopeResult => {
  const envelope =
    useSelector((state: RootState) => state.cardEdit.envelope) ??
    initialEnvelopeAddresses

  const senderLabels = useMemo(
    () => getAddressLabelLayout('sender', lang),
    [lang]
  )

  const recipientLabels = useMemo(
    () => getAddressLabelLayout('recipient', lang),
    [lang]
  )

  return {
    sender: envelope.sender,
    recipient: envelope.recipient,
    senderLabels,
    recipientLabels,
  }
}
