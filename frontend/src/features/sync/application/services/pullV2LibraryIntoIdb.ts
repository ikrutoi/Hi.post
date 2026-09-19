import {
  libraryItemUpdatedAt,
  type V2LibraryItem,
  type V2LibraryKind,
} from '../../domain/types/v2Library.types'
import { fetchV2Library } from '../../infrastructure/v2LibraryRemote'
import { enqueueLibraryUpsert } from '../../infrastructure/postcardV2PendingSync'
import { recipientAdapter } from '@db/adapters/storeAdapters/recipientAdapter'
import { cardtextAdapter } from '@db/adapters/storeAdapters/cardtextAdapter'
import { storeAdapters } from '@db/adapters/storeAdapters/storeAdapters'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { CardtextContent } from '@cardtext/domain/types'
import type { ImageMeta } from '@cardphoto/domain/types'

async function pullKind<T extends { id: string }>(
  kind: V2LibraryKind,
  localRows: T[],
  putLocal: (row: T) => Promise<void>,
  asLocal: (item: V2LibraryItem) => T | null,
  timeOf: (row: T) => number,
  mergePair?: (local: T, remote: T) => T,
): Promise<void> {
  const remote = (await fetchV2Library(kind))
    .map(asLocal)
    .filter((row): row is T => row != null)
  const { nextLocal, push } = mergeLibrary(localRows, remote, timeOf, mergePair)
  for (const row of nextLocal) {
    await putLocal(row)
  }
  for (const row of push) {
    enqueueLibraryUpsert(kind, row as unknown as V2LibraryItem)
  }
}

function mergeLibrary<T extends { id: string }>(
  localRows: T[],
  remoteRows: T[],
  timeOf: (row: T) => number,
  mergePair?: (local: T, remote: T) => T,
): { nextLocal: T[]; push: T[] } {
  const localById = new Map(localRows.map((row) => [row.id, row]))
  const remoteById = new Map(remoteRows.map((row) => [row.id, row]))
  const ids = new Set([...localById.keys(), ...remoteById.keys()])
  const nextLocal: T[] = []
  const push: T[] = []

  for (const id of ids) {
    const local = localById.get(id)
    const remote = remoteById.get(id)
    if (local && !remote) {
      nextLocal.push(local)
      push.push(local)
      continue
    }
    if (remote && !local) {
      nextLocal.push(remote)
      continue
    }
    if (local && remote) {
      const coalesced = mergePair ? mergePair(local, remote) : null
      if (timeOf(local) > timeOf(remote)) {
        nextLocal.push(coalesced ?? local)
        push.push(coalesced ?? local)
      } else {
        nextLocal.push(coalesced ?? remote)
      }
    }
  }

  return { nextLocal, push }
}

function coalesceCardphotoPair(
  local: ImageMeta & { id: string },
  remote: ImageMeta & { id: string },
): ImageMeta & { id: string } {
  const localWins = Number(local.timestamp ?? 0) > Number(remote.timestamp ?? 0)
  const winner = localWins ? local : remote
  const other = localWins ? remote : local
  const winnerHasBlob = winner.full?.blob instanceof Blob
  const otherHasBlob = other.full?.blob instanceof Blob
  const full = winnerHasBlob
    ? winner.full
    : otherHasBlob
      ? {
          ...winner.full,
          blob: other.full.blob,
          url: winner.full?.url || other.full.url,
          width: winner.full?.width || other.full.width,
          height: winner.full?.height || other.full.height,
        }
      : winner.full
  const winnerThumbBlob = winner.thumbnail?.blob instanceof Blob
  const otherThumbBlob = other.thumbnail?.blob instanceof Blob
  const thumbnail = winnerThumbBlob
    ? winner.thumbnail
    : otherThumbBlob && other.thumbnail
      ? {
          ...other.thumbnail,
          ...winner.thumbnail,
          blob: other.thumbnail.blob,
          url: winner.thumbnail?.url || other.thumbnail.url,
        }
      : winner.thumbnail
  return {
    ...winner,
    id: winner.id,
    url: winner.url || other.url,
    full,
    thumbnail,
    remoteFileId: winner.remoteFileId || other.remoteFileId,
  }
}

function asAddress(item: V2LibraryItem): AddressTemplateItem | null {
  const address = item.address as AddressTemplateItem['address'] | undefined
  if (address == null || typeof address !== 'object') return null
  return {
    id: item.id,
    localId: Number(item.localId ?? 0),
    address,
    listStatus: (item.listStatus as AddressTemplateItem['listStatus']) ?? 'inList',
    favorite: (item.favorite as boolean | null) ?? null,
    updatedAt: libraryItemUpdatedAt(item),
  }
}

function asCardtext(item: V2LibraryItem): (CardtextContent & { id: string }) | null {
  if (item.id == null) return null
  return {
    ...(item as unknown as CardtextContent),
    id: item.id,
    timestamp: Number(item.timestamp ?? libraryItemUpdatedAt(item)),
  }
}

function asCardphoto(item: V2LibraryItem): (ImageMeta & { id: string }) | null {
  if (item.id == null) return null
  return {
    ...(item as unknown as ImageMeta),
    id: item.id,
  }
}

export async function pullV2LibraryIntoIdb(): Promise<void> {
  const addresses = (await recipientAdapter.getAll()) as AddressTemplateItem[]
  await pullKind(
    'addresses',
    addresses.filter((row) => Boolean(row.id)),
    (row) => recipientAdapter.putLocal(row as AddressTemplateItem & { id: string }),
    asAddress,
    (row) => row.updatedAt ?? 0,
  )

  const texts = (await cardtextAdapter.getAll()) as CardtextContent[]
  await pullKind(
    'cardtexts',
    texts.filter((row): row is CardtextContent & { id: string } => Boolean(row.id)),
    (row) => cardtextAdapter.putLocal(row),
    asCardtext,
    (row) => row.timestamp ?? 0,
  )

  const photos = (await storeAdapters.cardphotoImages.getAll()) as ImageMeta[]
  const listed = photos.filter(
    (row) => row.id && (row.status === 'inLine' || row.status === 'outLine'),
  )
  await pullKind(
    'cardphotos',
    listed as Array<ImageMeta & { id: string }>,
    (row) => storeAdapters.cardphotoImages.putLocal(row),
    asCardphoto,
    (row) => Number(row.timestamp ?? 0),
    coalesceCardphotoPair,
  )
}
