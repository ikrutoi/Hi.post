import { Langs } from '@i18n/types'
import { senderLayout } from '../../../sender/domain/types'
import { recipientLayout } from '../../../recipient/domain/types'
import type { AddressLayout } from '../../domain/types'
import type { EnvelopeRole } from '@shared/config/constants'

export type Lang = (typeof Langs)[number]

export type AddressLabelsByLang = Record<Lang, AddressLayout>

const createEmptyLabels = (): AddressLabelsByLang =>
  Langs.reduce<Record<Lang, AddressLayout>>(
    (acc, lang) => {
      acc[lang] = []
      return acc
    },
    {} as Record<Lang, AddressLayout>
  )

export const addressLabels: Readonly<
  Record<EnvelopeRole, AddressLabelsByLang>
> = {
  sender: {
    ...createEmptyLabels(),
    en: senderLayout,
  },
  recipient: {
    ...createEmptyLabels(),
    en: recipientLayout,
  },
}
