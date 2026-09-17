import { createStoreAdapter } from '../factory/createStoreAdapter'
import type { StoreMap } from '@/db/types'
import { withLibraryRemoteSync } from '@features/sync/infrastructure/withLibraryRemoteSync'
import type { ImageMeta } from '@cardphoto/domain/types'

const base = createStoreAdapter<StoreMap['cardphotoImages']>('cardphotoImages')

export const cardphotoImagesAdapter = withLibraryRemoteSync(base, 'cardphotos', {
  shouldSync: (row) => {
    const status = (row as ImageMeta).status
    return status === 'inLine' || status === 'outLine'
  },
})
