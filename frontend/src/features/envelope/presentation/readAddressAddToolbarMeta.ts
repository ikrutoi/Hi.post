export type AddressAddToolbarMeta = {
  state: string
  badge: number | null
  badgeDot: boolean
}

export function readAddressAddToolbarMeta(
  toolbarState: Record<string, unknown>,
): AddressAddToolbarMeta {
  const raw = toolbarState.addressAdd
  if (raw == null) return { state: 'disabled', badge: null, badgeDot: false }
  if (typeof raw === 'string') return { state: raw, badge: null, badgeDot: false }
  if (typeof raw !== 'object' || raw == null || !('state' in raw)) {
    return { state: 'disabled', badge: null, badgeDot: false }
  }
  const options =
    'options' in raw && raw.options != null && typeof raw.options === 'object'
      ? (raw.options as { badge?: number | null; badgeDot?: boolean })
      : null
  return {
    state: String(raw.state ?? 'disabled'),
    badge: options?.badge ?? null,
    badgeDot: Boolean(options?.badgeDot),
  }
}

/** Incomplete draft reminder on addressAdd (dot). */
export function addressAddHasIndicator(meta: AddressAddToolbarMeta): boolean {
  return meta.badgeDot || meta.badge != null
}
