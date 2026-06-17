/** Element ids from IconUserRegistered SVG (`el-1` … `el-19`). */
export const ICON_USER_REGISTERED_ELEMENT_IDS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
] as const

export type IconUserRegisteredElementId =
  (typeof ICON_USER_REGISTERED_ELEMENT_IDS)[number]

/** Fill color per mosaic cell. */
export type IconUserRegisteredElementColors = Record<
  IconUserRegisteredElementId,
  string
>

export const USER_REGISTERED_SECTOR_COUNT = 19

/** Hue wheel is split into 19 sectors; each mosaic cell picks a color inside its sector. */
export const USER_REGISTERED_SECTOR_CONFIG = {
  saturationMin: 58,
  saturationMax: 82,
  lightnessMin: 48,
  lightnessMax: 62,
} as const

const USER_REGISTERED_PASSPORT_STORAGE_KEY = 'hi.userRegisteredPassport.v1'

type StoredUserRegisteredPassports = Record<string, IconUserRegisteredElementColors>

function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createSeededRandom(seed: string): () => number {
  let state = hashString(seed) || 1
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100
  const light = l / 100
  const chroma = (1 - Math.abs(2 * light - 1)) * sat
  const huePrime = h / 60
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1))
  let r1 = 0
  let g1 = 0
  let b1 = 0

  if (huePrime >= 0 && huePrime < 1) {
    r1 = chroma
    g1 = x
  } else if (huePrime < 2) {
    r1 = x
    g1 = chroma
  } else if (huePrime < 3) {
    g1 = chroma
    b1 = x
  } else if (huePrime < 4) {
    g1 = x
    b1 = chroma
  } else if (huePrime < 5) {
    r1 = x
    b1 = chroma
  } else {
    r1 = chroma
    b1 = x
  }

  const m = light - chroma / 2
  const r = Math.round((r1 + m) * 255)
  const g = Math.round((g1 + m) * 255)
  const b = Math.round((b1 + m) * 255)

  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

function pickColorInSector(
  sectorIndex: number,
  random: () => number,
): string {
  const hueSpan = 360 / USER_REGISTERED_SECTOR_COUNT
  const hue = (sectorIndex * hueSpan + random() * hueSpan) % 360
  const { saturationMin, saturationMax, lightnessMin, lightnessMax } =
    USER_REGISTERED_SECTOR_CONFIG
  const saturation =
    saturationMin + random() * (saturationMax - saturationMin)
  const lightness = lightnessMin + random() * (lightnessMax - lightnessMin)
  return hslToHex(hue, saturation, lightness)
}

/** Deterministic passport colors: one random shade per hue sector, seeded by user id. */
export function generateUserRegisteredElementColors(
  userId: string,
): IconUserRegisteredElementColors {
  return ICON_USER_REGISTERED_ELEMENT_IDS.reduce((acc, id, sectorIndex) => {
    const random = createSeededRandom(`${userId}:${id}`)
    acc[id] = pickColorInSector(sectorIndex, random)
    return acc
  }, {} as IconUserRegisteredElementColors)
}

function readStoredPassports(): StoredUserRegisteredPassports {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(USER_REGISTERED_PASSPORT_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as StoredUserRegisteredPassports
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStoredPassports(store: StoredUserRegisteredPassports): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    USER_REGISTERED_PASSPORT_STORAGE_KEY,
    JSON.stringify(store),
  )
}

function isCompleteElementColors(
  value: unknown,
): value is IconUserRegisteredElementColors {
  if (value == null || typeof value !== 'object') return false
  return ICON_USER_REGISTERED_ELEMENT_IDS.every(
    (id) =>
      typeof (value as IconUserRegisteredElementColors)[id] === 'string' &&
      (value as IconUserRegisteredElementColors)[id].length > 0,
  )
}

export function loadUserRegisteredElementColors(
  userId: string,
): IconUserRegisteredElementColors | null {
  const stored = readStoredPassports()[userId]
  if (stored == null) return null
  return isCompleteElementColors(stored) ? stored : null
}

export function saveUserRegisteredElementColors(
  userId: string,
  colors: IconUserRegisteredElementColors,
): void {
  const store = readStoredPassports()
  store[userId] = colors
  writeStoredPassports(store)
}

/**
 * Birth passport: generated once per user id and persisted locally.
 * Same user always gets the same mosaic; different users diverge inside hue sectors.
 */
export function getOrCreateUserRegisteredElementColors(
  userId: string,
): IconUserRegisteredElementColors {
  const existing = loadUserRegisteredElementColors(userId)
  if (existing != null) return existing

  const generated = generateUserRegisteredElementColors(userId)
  saveUserRegisteredElementColors(userId, generated)
  return generated
}
