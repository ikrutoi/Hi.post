import type { AddressFields } from '@shared/config/constants'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import type { RecipientState } from '@envelope/recipient/domain/types'
import type { PostcardHydrated } from '@entities/postcard'

export type FormatRecipientLayerOpts = {
  /** Для строки шаблона в конверте: показать черновик, если нет applied / appliedData. */
  useDraftWhenNoApplied?: boolean
}

/** В конверте есть закреплённый получатель (не полагаться на данные на открытке в корзине). */
export function hasCommittedSessionRecipient(
  recipient: RecipientState | undefined,
): boolean {
  if (!recipient) return false
  return (recipient.applied?.length ?? 0) > 0 || recipient.appliedData != null
}

export function formatDetailLineFromAddressFields(
  addr: AddressFields | null | undefined,
): string | undefined {
  if (!addr) return undefined
  const name = String(addr.name ?? '').trim()
  const city = String(addr.city ?? '').trim()
  const country = String(addr.country ?? '').trim()
  const region = [city, country].filter(Boolean).join(', ')
  if (name && region) return `${name}, ${region}`
  return name || region || undefined
}

export function formatDetailLineFromAddressBookEntry(
  entry: AddressBookEntry,
): string | undefined {
  return formatDetailLineFromAddressFields(entry.address)
}

/**
 * Строка «имя, регион» для списков дат / плана: только закреплённый выбор
 * (`appliedData` или `applied[0]` → книга / шаблон конверта), без «залипшего» viewDraft
 * после сброса получателей (applied пуст, appliedData null).
 */
export function formatRecipientDetailFromLayers(
  recipient: RecipientState | undefined,
  recipientEntries: AddressBookEntry[],
  envelopeRecipients: RecipientState[],
  opts?: FormatRecipientLayerOpts,
): string | undefined {
  if (!recipient) return undefined

  if (recipient.appliedData != null) {
    return formatDetailLineFromAddressFields(recipient.appliedData)
  }

  const appliedId = recipient.applied?.[0]
  if (appliedId) {
    const bookEntry = recipientEntries.find((e) => e.id === appliedId)
    if (bookEntry) {
      const line = formatDetailLineFromAddressBookEntry(bookEntry)
      if (line) return line
    }
    const envRow = envelopeRecipients.find(
      (row) => row.recipientViewId === appliedId,
    )
    if (envRow) {
      const line = formatRecipientDetailFromLayers(
        envRow,
        recipientEntries,
        envelopeRecipients,
        opts,
      )
      if (line) return line
    }
  }

  if (opts?.useDraftWhenNoApplied) {
    const source = recipient.viewDraft ?? recipient.formDraft ?? null
    if (
      source &&
      Object.values(source).some((v) => (v ?? '').toString().trim() !== '')
    ) {
      return formatDetailLineFromAddressFields(source)
    }
  }

  return undefined
}

export function formatRecipientLine(
  postcard: PostcardHydrated | undefined,
  recipientEntries: AddressBookEntry[],
  envelopeRecipients: RecipientState[],
): string | undefined {
  return formatRecipientDetailFromLayers(
    postcard?.card?.envelope?.recipient,
    recipientEntries,
    envelopeRecipients,
  )
}

export function formatPostcardRecipientDetail(
  postcard: PostcardHydrated | undefined,
  recipientEntries: AddressBookEntry[],
  envelopeRecipients: RecipientState[],
): string | undefined {
  if (!postcard) return undefined
  const r = postcard.card?.envelope?.recipient
  if (!r) return undefined
  const appliedId = r.applied?.[0]
  if (appliedId) {
    const bookEntry = recipientEntries.find((e) => e.id === appliedId)
    if (bookEntry) {
      const line = formatDetailLineFromAddressBookEntry(bookEntry)
      if (line) return line
    }
    const envRow = envelopeRecipients.find(
      (row) => row.recipientViewId === appliedId,
    )
    if (envRow) {
      const line = formatRecipientDetailFromLayers(
        envRow,
        recipientEntries,
        envelopeRecipients,
      )
      if (line) return line
    }
  }
  return formatRecipientLine(postcard, recipientEntries, envelopeRecipients)
}

/** Строка «имя, регион» для списков корзины / истории по снимку открытки. */
export function formatPostcardListRecipientDetailLine(
  postcard: PostcardHydrated | undefined,
  recipientEntries: AddressBookEntry[],
  envelopeRecipients: RecipientState[],
): string | undefined {
  const fromLayers = formatPostcardRecipientDetail(
    postcard,
    recipientEntries,
    envelopeRecipients,
  )
  if (fromLayers) return fromLayers

  const recipient = postcard?.card?.envelope?.recipient
  if (!recipient) return undefined
  const source =
    recipient.appliedData ?? recipient.viewDraft ?? recipient.formDraft ?? null
  return formatDetailLineFromAddressFields(source)
}
