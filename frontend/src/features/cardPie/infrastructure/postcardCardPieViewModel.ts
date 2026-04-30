import type { Card } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
import type { AddressFields } from '@shared/config/constants'
import {
  CARDTEXT_APPLIED_DISPLAY_STATUSES,
  createInitialCardtextContent,
  type CardtextContent,
} from '@cardtext/domain/editor/editor.types'
import type { DispatchDate } from '@entities/date'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { RecipientState } from '@envelope/recipient/domain/types'

export type CardPieInnerData = {
  cardphoto: { previewUrl: string | null; isComplete: boolean; id: string }
  cardtext: CardtextContent
  recipient: Readonly<AddressFields> | null
  recipientCount: number
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
  const branch =
    card.cardtext.appliedData ??
    card.cardtext.assetData ??
    createInitialCardtextContent()
  return {
    ...branch,
    value: branch.value.map((b) => ({
      ...b,
      children: b.children.map((c) => ({ ...c })),
    })),
    style: { ...branch.style },
  }
}

function recipientDisplayFields(
  recipient: RecipientState,
  recipientCount: number,
): Readonly<AddressFields> | null {
  if (recipientCount !== 1) return null
  const source =
    recipient.appliedData ??
    recipient.viewDraft ??
    recipient.formDraft
  return source
}

function cardphotoPreviewFromCard(card: Card): {
  previewUrl: string | null
  isComplete: boolean
  id: string
} {
  const applied = card.cardphoto?.appliedData
  const url =
    applied?.thumbnail?.url ||
    applied?.url ||
    (card.thumbnailUrl && typeof card.thumbnailUrl === 'string'
      ? card.thumbnailUrl
      : null) ||
    null
  const isComplete = Boolean(url)
  return {
    previewUrl: url,
    isComplete,
    id: applied?.id ?? card.id,
  }
}

function recipientAppliedCount(recipient: RecipientState): number {
  const n = recipient.applied?.length ?? 0
  if (n > 0) return n
  if (recipient.mode === 'recipients') {
    const a = recipient.recipientsViewIdsFirstList?.length ?? 0
    const b = recipient.recipientsViewIdsSecondList?.length ?? 0
    if (a + b > 0) return a + b
  }
  if (recipient.appliedData != null || recipient.formIsComplete) return 1
  return 0
}

export function buildCardPieInnerDataFromPostcard(
  postcard: PostcardHydrated,
): CardPieInnerData {
  const card = postcard.card
  const cardphoto = cardphotoPreviewFromCard(card)
  const cardtext = cardtextContentForPie(card)
  const recipient = card.envelope.recipient
  const recipientCount = recipientAppliedCount(recipient)
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
