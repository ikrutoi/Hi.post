import axios from 'axios'
import { httpClient } from '@shared/api/httpClient'
import type {
  PostcardSyncSnapshot,
  PostcardSyncUploadPayload,
} from '../domain/types/postcardSync.types'

export const fetchPostcardSyncApi = async (): Promise<PostcardSyncSnapshot | null> => {
  try {
    const response = await httpClient.get<PostcardSyncSnapshot>('/api/sync/postcards')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export const uploadPostcardSyncApi = (payload: PostcardSyncUploadPayload) =>
  httpClient.put<PostcardSyncSnapshot>('/api/sync/postcards', payload)
