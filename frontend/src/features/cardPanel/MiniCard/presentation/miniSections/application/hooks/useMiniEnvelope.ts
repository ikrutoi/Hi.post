import { useMemo } from 'react'
import { getAddressLabelLayout } from '@envelope/addressForm/application/helpers'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { DEFAULT_LANG } from '@i18n/config'
import type { AddressLabelLayout } from '@envelope/domain/types'
import type { Lang } from '@i18n/types'
import type { AddressFields } from '@shared/config/constants'

interface UseMiniEnvelopeResult {
  sender: AddressFields
  recipient: AddressFields
  senderLabels: AddressLabelLayout
  recipientLabels: AddressLabelLayout
}

export const useMiniEnvelope = (
  lang: Lang = DEFAULT_LANG
): UseMiniEnvelopeResult => {
  const { state } = useEnvelopeFacade()
  const { value } = state

  const senderLabels = useMemo(
    () => getAddressLabelLayout('sender', lang),
    [lang]
  )

  const recipientLabels = useMemo(
    () => getAddressLabelLayout('recipient', lang),
    [lang]
  )

  return {
    sender: value.sender,
    recipient: value.recipient,
    senderLabels,
    recipientLabels,
  }
}
