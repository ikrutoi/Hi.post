import { getApiErrorMessage } from '@shared/api/apiError'
import {
  fetchPostcardSyncApi,
  uploadPostcardSyncApi,
} from '../api/postcardSync.api'
import type {
  PostcardSyncSnapshot,
  PostcardSyncUploadPayload,
} from '../domain/types/postcardSync.types'
import type { PostcardSyncRepository } from './postcardSyncRepository'

export const httpPostcardSyncRepository: PostcardSyncRepository = {
  async fetchSnapshot() {
    try {
      return await fetchPostcardSyncApi()
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to load cloud backup'))
    }
  },

  async saveSnapshot(payload: PostcardSyncUploadPayload) {
    try {
      const response = await uploadPostcardSyncApi(payload)
      return response.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to save cloud backup'))
    }
  },
}
