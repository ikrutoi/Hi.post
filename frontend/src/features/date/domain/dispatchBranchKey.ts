import type { DispatchDate } from '@entities/date/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'

export function dispatchDateKeyFromDispatchDate(d: DispatchDate): string {
  return `${d.year}-${d.month}-${d.day}`
}

export function recipientBranchKeyFromEnvelope(
  envelopeVariant: EnvelopeSessionRecord,
): string {
  const r = envelopeVariant.recipient
  if (!r) return 'session'
  const applied = r.applied ?? []
  if (applied.length > 0) return applied[0] ?? 'session'
  if (r.recipientViewId) return r.recipientViewId
  return 'session'
}

export function buildDispatchBranchKey(
  date: DispatchDate,
  envelope: EnvelopeSessionRecord,
): string {
  return `${dispatchDateKeyFromDispatchDate(date)}|${recipientBranchKeyFromEnvelope(envelope)}`
}

export function dispatchBranchKeyFromPostcard(p: PostcardHydrated): string | null {
  const d = p.date
  if (!d) return null
  if (
    d.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    d.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    d.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  ) {
    return null
  }
  const ev = p.card.envelope as EnvelopeSessionRecord | undefined
  if (!ev) return null
  return buildDispatchBranchKey(d, ev)
}

export function parseDispatchBranchKey(
  branchKey: string,
): { date: DispatchDate; recipientSlotKey: string } | null {
  const pipe = branchKey.indexOf('|')
  if (pipe < 0) return null
  const dk = branchKey.slice(0, pipe)
  const recipientSlotKey = branchKey.slice(pipe + 1)
  const parts = dk.split('-').map((x) => Number(x))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null
  return {
    date: { year: parts[0], month: parts[1], day: parts[2] },
    recipientSlotKey,
  }
}
