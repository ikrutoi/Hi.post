/**
 * Phase 0 — backend inventory vs IndexedDB postcard canon.
 *
 * IndexedDB `postcards` is the product source of truth. Cloud copy is
 * `user_postcards` + `user_library_items` + `user_files`. Snapshot
 * `user_postcard_snapshots` is GET-only until v2 is populated.
 * Phase 6: `VITE_AUTH_MODE=http`; IndexedDB remains the working cache.
 *
 * Local-only IDB stores: session, uiPreferences, cardPieFavorites.
 * Image blobs stay in IDB as cache; http mode POSTs original/display/thumb
 * to `user_files` (`remoteFileId` on ImageMeta).
 */
export const BACKEND_CANON_PHASE = 0 as const

/** Opaque `user_postcard_snapshots.payload` version (PostcardHydrated[]). */
export const BACKEND_SYNC_PAYLOAD_VERSION = 1 as const

/** IndexedDB AppDB version — postcard row shape Laravel must follow. */
export const BACKEND_APP_DB_VERSION = 20 as const

/** Matches `POSTCARD_STATUSES` on PostcardHydrated.status */
export const BACKEND_POSTCARD_STATUSES = [
  'cart',
  'cartBlocked',
  'ready',
  'sent',
  'delivered',
  'error',
] as const

export type BackendPostcardStatus = (typeof BACKEND_POSTCARD_STATUSES)[number]

export const BACKEND_POSTCARD_REF_KEYS = [
  'cardphoto',
  'cardtext',
  'recipient',
  'aroma',
] as const

export type BackendPostcardRefKey = (typeof BACKEND_POSTCARD_REF_KEYS)[number]

export const BACKEND_ADDRESS_FIELDS = [
  'name',
  'street',
  'zip',
  'city',
  'country',
] as const

/** Dropped; do not recreate. */
export const DROPPED_LARAVEL_TABLES = [
  'postcards',
  'sender_templates',
  'recipient_templates',
  'text_templates',
] as const

/** Still in the DB: system catalog only — do not add user writes. */
export const FROZEN_LARAVEL_TABLES = ['image_templates'] as const

/**
 * Auth, v2 cloud copy, files, read-only snapshot GET.
 * `image_templates` is live only for GET templates/images/system.
 */
export const LIVE_LARAVEL_TABLES = [
  'users',
  'personal_access_tokens',
  'user_files',
  'user_postcards',
  'user_library_items',
  'user_postcard_snapshots',
  'image_templates',
] as const

/** IDB stores that become the new server model (phase 1+). */
export const IDB_CANON_STORES = [
  'postcards',
  'recipient',
  'cardtext',
  'cardphotoImages',
] as const

export type BackendPostcardCanonRow = {
  id: string
  localId: number
  status: BackendPostcardStatus
  price: string
  createdAt: number
  updatedAt: number
  date: { year: number; month: number; day: number }
  postcard: {
    cardphoto: string
    cardtext: string
    recipient: string
    aroma: string
  }
  card: {
    id: string
    thumbnailUrl: string
    cardphoto: unknown
    cardtext: unknown
    envelope: {
      recipient: unknown
      isComplete: boolean
    }
    aroma: { index: number }
    date: { year: number; month: number; day: number }
  }
}
