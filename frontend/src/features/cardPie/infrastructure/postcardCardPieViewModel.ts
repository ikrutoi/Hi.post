import type { Card } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
import type { AddressFields } from '@shared/config/constants'
import {
  CARDTEXT_APPLIED_DISPLAY_STATUSES,
  cardtextHasRenderableContent,
  createInitialCardtextContent,
  type CardtextContent,
} from '@cardtext/domain/editor/editor.types'
import { isCardtextDraftContentEmpty } from '@cardtext/domain/helpers/isCardtextDraftContentEmpty'
import type { DispatchDate } from '@entities/date'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { RecipientState } from '@envelope/recipient/domain/types'

export type CardPieInnerData = {
  cardphoto: {
    /** Мини-пирог / паттерн: сначала thumbnail. */
    previewUrl: string | null
    /** Полноразмерное отображение в фабрике (зеркало / peek). */
    factoryDisplayUrl: string | null
    isComplete: boolean
    id: string
  }
  cardtext: CardtextContent
  recipient: Readonly<AddressFields> | null
  recipientCount: number
  senderBadgeShow: boolean
  senderDisplayName: string | null
  /** Полный адрес отправителя для превью (peek); null если нет заполненных полей. */
  sender: Readonly<AddressFields> | null
  aroma: AromaItem | null
  date: DispatchDate | null
  dates: DispatchDate[]
}

export type CardPieSectionFlags = {
  cardphoto: boolean
  cardtext: boolean
  envelope: boolean
  aroma: boolean
  date: boolean
}

function isFilledDispatchDate(d: DispatchDate | null | undefined): boolean {
  if (d == null) return false
  return !(
    d.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    d.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    d.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  )
}

function cardtextContentForPie(card: Card): CardtextContent {
  const s = card.cardtext
  const draftBranch =
    s.draftData != null && !isCardtextDraftContentEmpty(s.draftData)
      ? s.draftData
      : null
  const presetBranch =
    s.presetData != null && !isCardtextDraftContentEmpty(s.presetData)
      ? s.presetData
      : null
  /** Сначала ветка с реальным текстом (в т.ч. вложенный Slate), иначе прежний приоритет applied → asset → draft → preset. */
  const picked =
    [s.appliedData, s.assetData, draftBranch, presetBranch].find(
      (b): b is CardtextContent => b != null && cardtextHasRenderableContent(b),
    ) ??
    s.appliedData ??
    s.assetData ??
    draftBranch ??
    presetBranch ??
    createInitialCardtextContent()
  return {
    ...picked,
    value: picked.value.map((b) => ({
      ...b,
      children: b.children.map((c) => ({ ...c })),
    })),
    style: { ...picked.style },
  }
}

function recipientDisplayFields(
  recipient: RecipientState,
  recipientCount: number,
): Readonly<AddressFields> | null {
  if (recipientCount !== 1) return null
  const source =
    recipient.appliedData ?? recipient.viewDraft ?? recipient.formDraft
  return source
}

function cardphotoUrlsFromCard(card: Card): {
  previewUrl: string | null
  factoryDisplayUrl: string | null
  isComplete: boolean
  id: string
} {
  const applied = card.cardphoto?.appliedData
  const thumb =
    applied?.thumbnail?.url != null && String(applied.thumbnail.url).trim() !== ''
      ? applied.thumbnail.url
      : null
  const main =
    typeof applied?.url === 'string' && applied.url.trim() !== ''
      ? applied.url
      : null
  const full =
    applied?.full?.url != null && String(applied.full.url).trim() !== ''
      ? applied.full.url
      : null
  const cardTn =
    card.thumbnailUrl != null &&
    typeof card.thumbnailUrl === 'string' &&
    card.thumbnailUrl.trim() !== ''
      ? card.thumbnailUrl
      : null

  const previewUrl = thumb || main || full || cardTn || null
  const factoryDisplayUrl = main || full || thumb || cardTn || null
  const isComplete = Boolean(previewUrl)
  return {
    previewUrl,
    factoryDisplayUrl,
    isComplete,
    id: applied?.id ?? card.id,
  }
}

export function recipientAppliedCount(recipient: RecipientState): number {
  const n = recipient.applied?.length ?? 0
  if (n > 0) return n
  const a = recipient.recipientsViewIdsFirstList?.length ?? 0
  const b = recipient.recipientsViewIdsSecondList?.length ?? 0
  if (a + b > 0) return a + b
  if (recipient.appliedData != null || recipient.formIsComplete) return 1
  return 0
}

const ADDRESS_KEYS: (keyof AddressFields)[] = [
  'name',
  'street',
  'city',
  'zip',
  'country',
]

function addressHasAnyField(
  fields: Readonly<AddressFields> | null | undefined,
): boolean {
  if (fields == null) return false
  return ADDRESS_KEYS.some((k) => String(fields[k] ?? '').trim().length > 0)
}

function snapshotSenderAddressFields(
  source: Readonly<Partial<AddressFields>> | null | undefined,
): Readonly<AddressFields> | null {
  if (source == null) return null
  const f: AddressFields = {
    name: String(source.name ?? ''),
    street: String(source.street ?? ''),
    city: String(source.city ?? ''),
    zip: String(source.zip ?? ''),
    country: String(source.country ?? ''),
  }
  return addressHasAnyField(f) ? f : null
}

function primarySenderDisplayLine(
  fields: Readonly<AddressFields> | null | undefined,
): string | null {
  if (fields == null) return null
  const name = String(fields.name ?? '').trim()
  if (name.length > 0) return name
  const city = String(fields.city ?? '').trim()
  const country = String(fields.country ?? '').trim()
  const region = [city, country].filter(Boolean).join(', ')
  if (region.length > 0) return region
  const street = String(fields.street ?? '').trim()
  const zip = String(fields.zip ?? '').trim()
  const tail = [street, zip].filter(Boolean).join(', ')
  return tail.length > 0 ? tail : null
}

function senderMiniFromCard(card: Card): {
  senderBadgeShow: boolean
  senderDisplayName: string | null
  sender: Readonly<AddressFields> | null
} {
  const s = card.envelope?.sender
  if (s == null || !s.enabled) {
    return { senderBadgeShow: false, senderDisplayName: null, sender: null }
  }
  const source =
    s.appliedData ??
    (s.applied.length > 0 ? s.viewDraft : null) ??
    s.viewDraft ??
    s.formDraft
  const displayName = primarySenderDisplayLine(source)
  const sender = snapshotSenderAddressFields(source ?? undefined)
  const hasBookApply = s.applied.length > 0
  const hasAppliedSnapshot = addressHasAnyField(s.appliedData)
  const senderBadgeShow =
    hasBookApply ||
    hasAppliedSnapshot ||
    addressHasAnyField(s.viewDraft) ||
    addressHasAnyField(s.formDraft)
  return { senderBadgeShow, senderDisplayName: displayName, sender }
}

export function buildCardPieInnerDataFromPostcard(
  postcard: PostcardHydrated,
): CardPieInnerData {
  const card = postcard.card
  const cardphoto = cardphotoUrlsFromCard(card)
  const cardtext = cardtextContentForPie(card)
  const recipient = card.envelope.recipient
  const recipientCount = recipientAppliedCount(recipient)
  const { senderBadgeShow, senderDisplayName, sender } = senderMiniFromCard(card)
  const datesFromCard = (card as Card & { dates?: DispatchDate[] }).dates
  const dates: DispatchDate[] =
    Array.isArray(datesFromCard) && datesFromCard.length > 0
      ? datesFromCard
      : isFilledDispatchDate(postcard.date)
        ? [postcard.date]
        : isFilledDispatchDate(card.date)
          ? [card.date]
          : []
  const date = dates[0] ?? null

  return {
    cardphoto,
    cardtext,
    recipient: recipientDisplayFields(recipient, recipientCount),
    recipientCount,
    senderBadgeShow,
    senderDisplayName,
    sender,
    aroma: card.aroma ?? null,
    date,
    dates,
  }
}

export function buildPieSectionFlagsFromInner(
  inner: CardPieInnerData,
  envelopeComplete: boolean,
): CardPieSectionFlags {
  const cardtextComplete =
    inner.cardtext.status != null &&
    CARDTEXT_APPLIED_DISPLAY_STATUSES.has(inner.cardtext.status)
  return {
    cardphoto: Boolean(inner.cardphoto.previewUrl),
    cardtext: cardtextComplete,
    envelope: envelopeComplete,
    aroma: Boolean(inner.aroma?.index),
    date: inner.dates.length > 0,
  }
}

export function buildPieSectionFlagsFromPostcard(
  postcard: PostcardHydrated,
): CardPieSectionFlags {
  const inner = buildCardPieInnerDataFromPostcard(postcard)
  return buildPieSectionFlagsFromInner(
    inner,
    Boolean(postcard.card.envelope?.isComplete),
  )
}

export function isPostcardPieAllComplete(flags: CardPieSectionFlags): boolean {
  return (
    flags.cardphoto &&
    flags.cardtext &&
    flags.envelope &&
    flags.aroma &&
    flags.date
  )
}
