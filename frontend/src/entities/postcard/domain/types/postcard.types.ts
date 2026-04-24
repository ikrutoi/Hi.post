import { DispatchDate } from '@/entities/date'
import type { Card } from '@entities/card/domain/types'
import { LEGACY_LOCAL_ID_PROPERTY } from '@shared/config/legacyIndexedDb'

export const POSTCARD_STATUSES = [
  'cart',
  'ready',
  // 'favorite',
  'sent',
  'delivered',
  'error',
] as const

export type PostcardStatus = (typeof POSTCARD_STATUSES)[number]

export type CardStatus = PostcardStatus | 'favorite'

export type PostcardStatuses = {
  cart: boolean
  ready: boolean
  sent: boolean
  delivered: boolean
  error: boolean
}

export type PostcardStatusesCount = {
  cart: number | null
  ready: number | null
  sent: number | null
  delivered: number | null
  error: number | null
}

export const POSTCARD_DISPATCH_DATE_FALLBACK: DispatchDate = {
  year: 0,
  month: 0,
  day: 0,
}

function isDispatchDateShape(v: unknown): v is DispatchDate {
  if (v == null || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return (
    typeof o.year === 'number' &&
    typeof o.month === 'number' &&
    typeof o.day === 'number'
  )
}

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

function stripSessionFlagsFromCard(card: Card): Card {
  if (!('isProcessed' in (card as object))) return card
  const { isProcessed: _removed, ...rest } = card
  return rest as Card
}

export interface PostcardRecordMeta {
  id: number
  price: string
  createdAt: number
  updatedAt: number
  date: DispatchDate
}

export interface PostcardRefs {
  cardphoto: string
  cardtext: string
  sender: string
  recipient: string
  aroma: string
}

export interface Postcard extends PostcardRecordMeta {
  status: CardStatus
  card: Card
}

export interface PostcardsDaySummary {
  postcard: Postcard
  count: number
}

function coercePostcardBodyId(
  row: Postcard & Record<string, unknown>,
  cardBase: Card,
): number {
  if (typeof row.id === 'number' && row.id > 0) return row.id
  const legacyLocalId = row.localId
  if (typeof legacyLocalId === 'number' && legacyLocalId > 0) {
    return legacyLocalId
  }
  const legacy = row[LEGACY_LOCAL_ID_PROPERTY]
  if (typeof legacy === 'number' && legacy > 0) return legacy
  const idStr = typeof row.id === 'string' ? row.id : ''
  if (/^\d+$/.test(idStr)) {
    const n = Number.parseInt(idStr, 10)
    if (n > 0) return n
  }
  const cid = typeof cardBase.id === 'string' ? cardBase.id : ''
  const suffix = cid.match(/__(\d+)$/)
  if (suffix) return Number.parseInt(suffix[1], 10)
  return 0
}

export function normalizePostcardRecord(raw: Postcard): Postcard {
  const row = raw as Postcard & Record<string, unknown>

  const rawCard = row.card as
    | (Card & { status?: string; meta?: Partial<PostcardRecordMeta> })
    | undefined
  const cardBase = rawCard ?? ({} as Card)
  const liftedFromNested =
    row.status === undefined && rawCard?.status !== undefined
      ? rawCard.status
      : undefined

  const coercePipelineStatus = (raw: string | undefined): PostcardStatus => {
    if (raw == null || raw === '' || raw === 'processed') return 'cart'
    return (POSTCARD_STATUSES as readonly string[]).includes(raw)
      ? (raw as PostcardStatus)
      : 'cart'
  }

  const status: PostcardStatus = coercePipelineStatus(
    ((row.status as string | undefined) ?? liftedFromNested) as
      | string
      | undefined,
  )

  const legacyMeta =
    (cardBase as Card & { meta?: Partial<PostcardRecordMeta> }).meta ??
    (row as { meta?: Partial<PostcardRecordMeta> }).meta

  let card = stripLegacyStatusFromCard(cardBase as Card)
  card = stripLegacyMetaFromCard(card)
  card = stripSessionFlagsFromCard(card)

  const id = coercePostcardBodyId(row, card)

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

  const date: DispatchDate = isDispatchDateShape(row.date)
    ? row.date
    : isDispatchDateShape(legacyMeta?.date)
      ? legacyMeta.date
      : isDispatchDateShape(card.date)
        ? card.date
        : POSTCARD_DISPATCH_DATE_FALLBACK

  const next: Postcard = {
    id,
    price,
    date,
    status,
    createdAt,
    updatedAt,
    card,
  }
  return next
}
