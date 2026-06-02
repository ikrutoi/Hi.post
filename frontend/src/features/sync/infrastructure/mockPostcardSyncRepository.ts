import type {
  PostcardSyncSnapshot,
  PostcardSyncUploadPayload,
} from '../domain/types/postcardSync.types'
import type { PostcardSyncRepository } from './postcardSyncRepository'

export const mockPostcardSyncRepository: PostcardSyncRepository = {
  async fetchSnapshot() {
    return null
  },

  async saveSnapshot(payload: PostcardSyncUploadPayload): Promise<PostcardSyncSnapshot> {
    return {
      version: payload.version,
      exportedAt: payload.exportedAt,
      postcards: payload.postcards,
      updatedAt: new Date().toISOString(),
    }
  },
}
