import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, RecipientAdapter } from '@/db/types'
import { withLibraryRemoteSync } from '@features/sync/infrastructure/withLibraryRemoteSync'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'

const base = createStoreAdapter<StoreMap['recipient']>('recipient')
const synced = withLibraryRemoteSync(base, 'addresses', {
  stamp: (row) => ({ ...row, updatedAt: Date.now() }),
})

export const recipientAdapter: RecipientAdapter & {
  putLocal: typeof base.put
} = {
  ...synced,
  addUniqueRecord: async (payload) => {
    const localId = (await base.getMaxLocalId()) + 1
    const listStatus = payload.listStatus ?? 'inList'
    const favorite =
      listStatus === 'outList' ? null : (payload.favorite ?? false)
    await synced.put({
      ...payload,
      localId,
      listStatus,
      favorite,
    } as AddressTemplateItem & { id: string })
  },
}
