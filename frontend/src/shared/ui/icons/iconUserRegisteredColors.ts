/** Shared passport cell ids (`el-1` … `el-24`) for all emblem form variants. */
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
  '20',
  '21',
  '22',
  '23',
  '24',
] as const

export type IconUserRegisteredElementId =
  (typeof ICON_USER_REGISTERED_ELEMENT_IDS)[number]

/** Emblem geometry variants — colors stay fixed; form is user preference. */
export const USER_REGISTERED_EMBLEM_FORMS = ['triangles', 'waves'] as const

export type UserRegisteredEmblemForm =
  (typeof USER_REGISTERED_EMBLEM_FORMS)[number]

export const DEFAULT_USER_REGISTERED_EMBLEM_FORM: UserRegisteredEmblemForm =
  'triangles'

export function isUserRegisteredEmblemForm(
  value: unknown,
): value is UserRegisteredEmblemForm {
  return (
    typeof value === 'string' &&
    (USER_REGISTERED_EMBLEM_FORMS as readonly string[]).includes(value)
  )
}

export function resolveUserRegisteredEmblemForm(
  form?: UserRegisteredEmblemForm | null,
): UserRegisteredEmblemForm {
  return isUserRegisteredEmblemForm(form)
    ? form
    : DEFAULT_USER_REGISTERED_EMBLEM_FORM
}

/** Cycle triangles → waves → … (extend `USER_REGISTERED_EMBLEM_FORMS` for more). */
export function nextUserRegisteredEmblemForm(
  form?: UserRegisteredEmblemForm | null,
): UserRegisteredEmblemForm {
  const current = resolveUserRegisteredEmblemForm(form)
  const index = USER_REGISTERED_EMBLEM_FORMS.indexOf(current)
  return USER_REGISTERED_EMBLEM_FORMS[
    (index + 1) % USER_REGISTERED_EMBLEM_FORMS.length
  ]
}

/** Fill color per mosaic cell. */
export type IconUserRegisteredElementColors = Record<
  IconUserRegisteredElementId,
  string
>

export const USER_REGISTERED_SECTOR_COUNT = 24

/** Hue wheel is split into 24 sectors; each cell gets a unique sector, then a random color inside it. */
export const USER_REGISTERED_SECTOR_CONFIG = {
  saturationMin: 58,
  saturationMax: 82,
  lightnessMin: 48,
  lightnessMax: 62,
} as const

/** Guest emblem: unique lightness slot per cell, random gray inside it. */
export const USER_REGISTERED_GUEST_GRAY_CONFIG = {
  lightnessMin: 34,
  lightnessMax: 78,
} as const

const GUEST_GRAY_SESSION_STORAGE_KEY = 'hi.post.guestPassportGraySeed'

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

function pickGrayInSector(sectorIndex: number, random: () => number): string {
  const { lightnessMin, lightnessMax } = USER_REGISTERED_GUEST_GRAY_CONFIG
  const lightnessSpan = (lightnessMax - lightnessMin) / USER_REGISTERED_SECTOR_COUNT
  const baseLightness = lightnessMin + sectorIndex * lightnessSpan
  const lightness = Math.min(
    lightnessMax,
    baseLightness + random() * lightnessSpan,
  )
  return hslToHex(0, 0, lightness)
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

function shuffleSectorIndices(userId: string): number[] {
  const sectors = Array.from(
    { length: USER_REGISTERED_SECTOR_COUNT },
    (_, index) => index,
  )
  const random = createSeededRandom(`${userId}:sectors`)

  for (let i = sectors.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[sectors[i], sectors[j]] = [sectors[j]!, sectors[i]!]
  }

  return sectors
}

function generateUserRegisteredElementColorsFromSeed(
  seed: string,
): IconUserRegisteredElementColors {
  const sectorAssignments = shuffleSectorIndices(seed)

  return ICON_USER_REGISTERED_ELEMENT_IDS.reduce((acc, id, index) => {
    const random = createSeededRandom(`${seed}:${id}`)
    const sectorIndex = sectorAssignments[index] ?? 0
    acc[id] = pickColorInSector(sectorIndex, random)
    return acc
  }, {} as IconUserRegisteredElementColors)
}

function generateGuestUserRegisteredElementColorsFromSeed(
  seed: string,
): IconUserRegisteredElementColors {
  const sectorAssignments = shuffleSectorIndices(`${seed}:guest-gray`)

  return ICON_USER_REGISTERED_ELEMENT_IDS.reduce((acc, id, index) => {
    const random = createSeededRandom(`${seed}:${id}:guest-gray`)
    const sectorIndex = sectorAssignments[index] ?? 0
    acc[id] = pickGrayInSector(sectorIndex, random)
    return acc
  }, {} as IconUserRegisteredElementColors)
}

function readGuestGraySeed(): string {
  if (typeof window === 'undefined') return 'guest'
  const existing = window.sessionStorage.getItem(GUEST_GRAY_SESSION_STORAGE_KEY)
  if (existing != null && existing.length > 0) return existing
  const seed = `${Date.now()}:${Math.random()}`
  window.sessionStorage.setItem(GUEST_GRAY_SESSION_STORAGE_KEY, seed)
  return seed
}

/** Guest toolbar emblem: random gray mosaic, stable for the browser session. */
export function resolveGuestUserRegisteredElementColors(): IconUserRegisteredElementColors {
  return generateGuestUserRegisteredElementColorsFromSeed(readGuestGraySeed())
}

/** Deterministic passport colors: unique random sector per cell, then random shade inside it. */
export function generateUserRegisteredElementColors(
  userId: string,
): IconUserRegisteredElementColors {
  return generateUserRegisteredElementColorsFromSeed(userId)
}

/** Non-deterministic reroll for dev/testing: new unique sector assignment each call. */
export function rerollUserRegisteredElementColors(): IconUserRegisteredElementColors {
  return generateUserRegisteredElementColorsFromSeed(
    `${Date.now()}:${Math.random()}`,
  )
}

export function isCompleteElementColors(
  value: unknown,
): value is IconUserRegisteredElementColors {
  if (value == null || typeof value !== 'object') return false
  return ICON_USER_REGISTERED_ELEMENT_IDS.every(
    (id) =>
      typeof (value as IconUserRegisteredElementColors)[id] === 'string' &&
      (value as IconUserRegisteredElementColors)[id].length > 0,
  )
}

/** Prefer server-stored passport; fall back to deterministic generation (mock mode). */
export function resolveUserRegisteredElementColors(
  userId: string,
  passportColors?: IconUserRegisteredElementColors | null,
): IconUserRegisteredElementColors {
  if (passportColors != null && isCompleteElementColors(passportColors)) {
    return passportColors
  }

  return generateUserRegisteredElementColors(userId)
}

/** White share when softening passport fills for panel chrome (≈ Sass `color.mix(#fff, $c, 32%)`). */
export const USER_REGISTERED_PASTEL_CHROME_WHITE_MIX = 0.68

function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.min(255, channel)).toString(16).padStart(2, '0'),
    )
    .join('')}`
}

function mixHexWithWhite(hex: string, whiteMix: number): string {
  const rgb = parseHexColor(hex)
  if (rgb == null) return hex

  const originalMix = 1 - whiteMix
  return rgbToHex(
    Math.round(rgb.r * originalMix + 255 * whiteMix),
    Math.round(rgb.g * originalMix + 255 * whiteMix),
    Math.round(rgb.b * originalMix + 255 * whiteMix),
  )
}

/** Lighten passport palette for soft chrome backgrounds while keeping hue identity. */
export function toPastelUserRegisteredElementColors(
  colors: Partial<IconUserRegisteredElementColors>,
  whiteMix: number = USER_REGISTERED_PASTEL_CHROME_WHITE_MIX,
): Partial<IconUserRegisteredElementColors> {
  return Object.fromEntries(
    Object.entries(colors).map(([id, color]) => [
      id,
      mixHexWithWhite(color, whiteMix),
    ]),
  ) as Partial<IconUserRegisteredElementColors>
}

const PASSPORT_CODE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const PASSPORT_CODE_PATTERN =
  /^Hi-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/

/** Deterministic Hi-XXXX-XXXX-XXXX-XXXX passport number seeded by user id. */
export function generatePassportCode(userId: string): string {
  const random = createSeededRandom(`${userId}:passport-code`)
  let chars = ''

  for (let i = 0; i < 16; i += 1) {
    const index = Math.floor(random() * PASSPORT_CODE_CHARS.length)
    chars += PASSPORT_CODE_CHARS[index] ?? '0'
  }

  return `Hi-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}-${chars.slice(12, 16)}`
}

export function isValidPassportCode(value: unknown): value is string {
  return typeof value === 'string' && PASSPORT_CODE_PATTERN.test(value)
}

/** Prefer server-stored passport code; fall back to deterministic generation (mock mode). */
export function resolvePassportCode(
  userId: string,
  passportCode?: string | null,
): string {
  if (isValidPassportCode(passportCode)) {
    return passportCode
  }

  return generatePassportCode(userId)
}
