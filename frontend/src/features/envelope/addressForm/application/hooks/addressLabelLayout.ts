import { Langs } from '@i18n/types'
import {
  senderEnLayout,
  recipientEnLayout,
} from '@envelope/addressForm/domain/types'
import type { EnvelopeRole } from '@shared/config/constants'
import type { AddressLabelsByLang } from '../../../domain/types'

const createEmptyLabels = (): AddressLabelsByLang =>
  Langs.reduce((acc, lang) => {
    acc[lang] = []
    return acc
  }, {} as AddressLabelsByLang)

export const addressLabels: Readonly<
  Record<EnvelopeRole, AddressLabelsByLang>
> = {
  sender: {
    ...createEmptyLabels(),
    en: senderEnLayout,
    // ru: senderRuLayout,
  },
  recipient: {
    ...createEmptyLabels(),
    en: recipientEnLayout,
    // ru: recipientRuLayout,
  },
}
