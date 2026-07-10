import type { PostcardStatus } from '@entities/postcard'

/** Dev-only cycle: cart → ready → sent → delivered → error → cart. */
export const DEBUG_POSTCARD_STATUS_CYCLE = [
  'cart',
  'ready',
  'sent',
  'delivered',
  'error',
] as const satisfies readonly PostcardStatus[]

export function nextDebugPostcardStatus(current: PostcardStatus): PostcardStatus {
  const normalized = current === 'cartBlocked' ? 'cart' : current
  const idx = DEBUG_POSTCARD_STATUS_CYCLE.indexOf(
    normalized as (typeof DEBUG_POSTCARD_STATUS_CYCLE)[number],
  )
  if (idx === -1) return 'cart'
  return DEBUG_POSTCARD_STATUS_CYCLE[(idx + 1) % DEBUG_POSTCARD_STATUS_CYCLE.length]
}

export const isDebugPostcardStatusCycleEnabled =
  import.meta.env.DEV === true
