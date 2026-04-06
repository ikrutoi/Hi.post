import type { Card } from '@entities/card/domain/types'
import { LEGACY_LOCAL_ID_PROPERTY } from '@shared/config/legacyIndexedDb'

export const CARD_STATUSES = [
  'processed',
  'cart',
  'ready',
  'favorite',
  'sent',
  'delivered',
  'error',
] as const

export type CardStatus = (typeof CARD_STATUSES)[number]

function stripLegacyStatusFromCard(card: Card): Card {
  if (!('status' in (card as object))) return card
  const { status: _removed, ...rest } = card as Card & { status: unknown }
  return rest as Card
}

function stripLegacyMetaFromCard(card: Card): Card {
  if (!('meta' in (card as object))) return card
  const { meta: _removed, ...rest } = card as Card & { meta?: unknown }
  return rest as Card
}

export interface PostcardRecordMeta {
  localId: number
  price: string
  createdAt: number
  updatedAt: number
}

export interface Postcard extends PostcardRecordMeta {
  status: CardStatus
  card: Card
}

export interface PostcardsDaySummary {
  postcard: Postcard
  count: number
}

export function makeSessionPostcardLocalId(batchIndex = 0): number {
  return -Math.abs(Date.now() + batchIndex)
}

export function normalizePostcardRecord(raw: Postcard): Postcard {
  const row = raw as Postcard & Record<string, unknown>
  const legacy = row[LEGACY_LOCAL_ID_PROPERTY]
  const localId =
    typeof row.localId === 'number'
      ? row.localId
      : typeof legacy === 'number'
        ? legacy
        : 0

  const rawCard = row.card as
    | (Card & { status?: CardStatus; meta?: Partial<PostcardRecordMeta> })
    | undefined
  const cardBase = rawCard ?? ({} as Card)
  const liftedFromNested =
    row.status === undefined && rawCard?.status !== undefined
      ? rawCard.status
      : undefined

  const status: CardStatus =
    (row.status as CardStatus | undefined) ?? liftedFromNested ?? 'cart'

  const legacyMeta =
    (cardBase as Card & { meta?: Partial<PostcardRecordMeta> }).meta ??
    (row as { meta?: Partial<PostcardRecordMeta> }).meta

  let card = stripLegacyStatusFromCard(cardBase as Card)
  card = stripLegacyMetaFromCard(card)

  const now = Date.now()
  const createdAt =
    typeof row.createdAt === 'number'
      ? row.createdAt
      : (legacyMeta?.createdAt ?? now)
  const updatedAt =
    typeof row.updatedAt === 'number'
      ? row.updatedAt
      : (legacyMeta?.updatedAt ?? createdAt)

  const price = String(row.price ?? legacyMeta?.price ?? '')

  const next: Postcard = {
    localId,
    price,
    status,
    createdAt,
    updatedAt,
    card,
  }
  return next
}
