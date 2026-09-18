import type { ImageMeta } from '@cardphoto/domain/types'
import { recipientAdapter } from '@db/adapters/storeAdapters/recipientAdapter'
import { cardtextAdapter } from '@db/adapters/storeAdapters/cardtextAdapter'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { storeAdapters } from '@db/adapters/storeAdapters/storeAdapters'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import { readAuthSession } from '@features/auth/infrastructure/sessionStorage'
import type { CardtextContent } from '@cardtext/domain/types'
import { pushImageMetaToRemoteFiles } from '@features/files/application/pushImageMetaToRemoteFiles'
import { isHttpAuthMode } from '@shared/config/authMode'
import type { V2LibraryItem } from '../../domain/types/v2Library.types'
import {
  enqueueLibraryUpsert,
  enqueuePostcardUpsert,
  flushPendingV2Sync,
  hasPendingV2Sync,
} from '../../infrastructure/postcardV2PendingSync'

const CUTOVER_FLAG_PREFIX = 'hi.post.phase6.idbToV2.'

function cutoverFlagKey(userId: string): string {
  return `${CUTOVER_FLAG_PREFIX}${userId}`
}

function asImageMeta(value: unknown): ImageMeta | null {
  if (value == null || typeof value !== 'object') return null
  const id = (value as { id?: unknown }).id
  if (typeof id !== 'string' || id.length === 0) return null
  return value as ImageMeta
}

async function ensureCardphotoRow(meta: ImageMeta): Promise<void> {
  const existing = await storeAdapters.cardphotoImages.getById(meta.id)
  if (existing) return
  if (!meta.full?.blob && !meta.thumbnail?.blob) return
  await storeAdapters.cardphotoImages.putLocal({ ...meta, id: meta.id })
}

async function collectLocalImageIds(): Promise<string[]> {
  const ids = new Set<string>()
  const stored = await storeAdapters.cardphotoImages.getAll()
  for (const row of stored) {
    if (row.id) ids.add(String(row.id))
  }

  const postcards = await postcardsAdapter.getAll()
  for (const postcard of postcards) {
    const applied = asImageMeta(postcard.card?.cardphoto?.appliedData)
    if (!applied) continue
    ids.add(applied.id)
    await ensureCardphotoRow(applied)
  }

  return [...ids]
}

async function patchPostcardsWithRemoteFileIds(): Promise<void> {
  const postcards = await postcardsAdapter.getAll()
  const now = Date.now()

  for (const postcard of postcards) {
    const applied = asImageMeta(postcard.card?.cardphoto?.appliedData)
    if (!applied) continue

    const stored = (await storeAdapters.cardphotoImages.getById(
      applied.id,
    )) as ImageMeta | null
    const remoteFileId = stored?.remoteFileId
    if (!remoteFileId || applied.remoteFileId === remoteFileId) continue

    const next: PostcardHydrated = {
      ...postcard,
      updatedAt: Math.max(postcard.updatedAt ?? 0, now),
      card: {
        ...postcard.card,
        cardphoto: {
          ...postcard.card.cardphoto,
          appliedData: {
            ...applied,
            remoteFileId,
            timestamp: stored?.timestamp ?? applied.timestamp,
          },
        },
      },
    }
    await postcardsAdapter.putLocal(next)
  }
}

async function enqueueAllLocalRows(): Promise<void> {
  for (const row of await postcardsAdapter.getAll()) {
    enqueuePostcardUpsert(row)
  }

  const addresses = (await recipientAdapter.getAll()) as AddressTemplateItem[]
  for (const row of addresses) {
    if (!row.id) continue
    enqueueLibraryUpsert('addresses', row as unknown as V2LibraryItem)
  }

  const texts = (await cardtextAdapter.getAll()) as CardtextContent[]
  for (const row of texts) {
    if (!row.id) continue
    enqueueLibraryUpsert('cardtexts', row as unknown as V2LibraryItem)
  }

  const photos = (await storeAdapters.cardphotoImages.getAll()) as ImageMeta[]
  for (const row of photos) {
    if (!row.id) continue
    if (row.status !== 'inLine' && row.status !== 'outLine') continue
    enqueueLibraryUpsert('cardphotos', row as unknown as V2LibraryItem)
  }
}

/** Upload IDB blobs missing `remoteFileId` and stamp postcards before LWW pull. */
export async function pushLocalIdbFilesToV2(): Promise<void> {
  if (!isHttpAuthMode() || !readAuthSession()?.token) return

  for (const id of await collectLocalImageIds()) {
    try {
      await pushImageMetaToRemoteFiles(id)
    } catch {
      // Blob stays in IndexedDB; retry on the next signed-in session.
    }
  }

  await patchPostcardsWithRemoteFileIds()
}

/**
 * First http login per user: push the whole IndexedDB cache to /v2.
 * Later sessions only flush whatever LWW already queued.
 */
export async function flushLocalIdbToV2AfterPull(): Promise<void> {
  if (!isHttpAuthMode()) return
  const session = readAuthSession()
  const userId = session?.user?.id != null ? String(session.user.id) : ''
  if (!session?.token || !userId) return

  const flagKey = cutoverFlagKey(userId)
  const alreadyCutOver =
    typeof localStorage !== 'undefined' && localStorage.getItem(flagKey) === '1'

  if (!alreadyCutOver) {
    await enqueueAllLocalRows()
  }

  await flushPendingV2Sync()

  if (!alreadyCutOver && !hasPendingV2Sync() && typeof localStorage !== 'undefined') {
    localStorage.setItem(flagKey, '1')
  }
}
