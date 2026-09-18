import type { ImageMeta } from '@cardphoto/domain/types'
import { getApiErrorMessage } from '@shared/api/apiError'
import { isHttpAuthMode } from '@shared/config/authMode'
import {
  fetchUserFileVariantApi,
  uploadUserFileApi,
} from '../api/files.api'
import type { UserFilePayload, UserFileUploadInput } from '../domain/types/userFile.types'

export interface FileRepository {
  upload(input: UserFileUploadInput): Promise<UserFilePayload>
  downloadVariant(id: string, variant: 'original' | 'display' | 'thumb'): Promise<Blob>
}

const httpFileRepository: FileRepository = {
  async upload(input) {
    try {
      const response = await uploadUserFileApi(input)
      return response.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'File upload failed'))
    }
  },

  async downloadVariant(id, variant) {
    try {
      const response = await fetchUserFileVariantApi(id, variant)
      return response.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'File download failed'))
    }
  },
}

export function getFileRepository(): FileRepository | null {
  if (isHttpAuthMode()) {
    return httpFileRepository
  }
  return null
}

export function imageMetaToUploadInput(meta: ImageMeta): UserFileUploadInput | null {
  const original = meta.full?.blob
  if (!original) return null

  return {
    original,
    thumb: meta.thumbnail?.blob ?? null,
    originalWidth: meta.full.width || meta.width,
    originalHeight: meta.full.height || meta.height,
    thumbWidth: meta.thumbnail?.width,
    thumbHeight: meta.thumbnail?.height,
  }
}
