import type { RootState } from '@app/state'

type CardphotoAddOptions = {
  badge?: number | string | null
  badgeDot?: boolean
}

function normalizeCardphotoAddEntry(raw: unknown): {
  state: string
  options: CardphotoAddOptions
} {
  if (typeof raw === 'string') {
    return { state: raw, options: {} }
  }

  if (!raw || typeof raw !== 'object') {
    return { state: 'enabled', options: {} }
  }

  const entry = raw as { state?: unknown; options?: CardphotoAddOptions }
  let state = entry.state
  let options = entry.options ?? {}

  // Legacy bug: `{ state: { state, options } }` from syncToolbarContext.
  if (state && typeof state === 'object') {
    const nested = state as { state?: string; options?: CardphotoAddOptions }
    state = nested.state ?? 'enabled'
    options = { ...nested.options, ...options }
  }

  return {
    state: typeof state === 'string' ? state : 'enabled',
    options,
  }
}

/** Фактическое состояние cardphotoAdd на главном тулбаре (как в UI). */
export function readCardphotoAddToolbarVisual(state: RootState): {
  enabled: boolean
  hasBadge: boolean
  hasDot: boolean
} {
  const section = state.toolbar.cardphoto
  const normalized = normalizeCardphotoAddEntry(section?.cardphotoAdd)

  const configIcon = section?.config
    ?.flatMap((group) => group.icons)
    .find((icon) => icon.key === 'cardphotoAdd')

  const options = { ...configIcon?.options, ...normalized.options }

  const badge = options.badge
  const hasBadge =
    badge != null &&
    (typeof badge === 'number' || typeof badge === 'string') &&
    String(badge).trim().length > 0

  return {
    enabled: normalized.state !== 'disabled',
    hasBadge,
    hasDot: Boolean(options.badgeDot),
  }
}
