import type {
  PostcardSyncSnapshot,
  PostcardSyncUploadPayload,
} from '../domain/types/postcardSync.types'

export interface PostcardSyncRepository {
  fetchSnapshot(): Promise<PostcardSyncSnapshot | null>
  saveSnapshot(payload: PostcardSyncUploadPayload): Promise<PostcardSyncSnapshot>
}
