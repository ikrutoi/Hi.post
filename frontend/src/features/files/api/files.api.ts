import { httpClient } from '@shared/api/httpClient'
import type {
  FileVariant,
  UserFilePayload,
  UserFileUploadInput,
} from '../domain/types/userFile.types'

function blobFilename(blob: Blob, fallback: string): string {
  const type = blob.type || 'application/octet-stream'
  if (type.includes('png')) return `${fallback}.png`
  if (type.includes('webp')) return `${fallback}.webp`
  return `${fallback}.jpg`
}

export function uploadUserFileApi(input: UserFileUploadInput) {
  const form = new FormData()
  form.append('original', input.original, blobFilename(input.original, 'original'))
  if (input.display) {
    form.append('display', input.display, blobFilename(input.display, 'display'))
  }
  if (input.thumb) {
    form.append('thumb', input.thumb, blobFilename(input.thumb, 'thumb'))
  }
  if (input.originalWidth != null) form.append('originalWidth', String(input.originalWidth))
  if (input.originalHeight != null) {
    form.append('originalHeight', String(input.originalHeight))
  }
  if (input.displayWidth != null) form.append('displayWidth', String(input.displayWidth))
  if (input.displayHeight != null) form.append('displayHeight', String(input.displayHeight))
  if (input.thumbWidth != null) form.append('thumbWidth', String(input.thumbWidth))
  if (input.thumbHeight != null) form.append('thumbHeight', String(input.thumbHeight))

  return httpClient.post<UserFilePayload>('/api/files', form)
}

export const fetchUserFileApi = (id: string) =>
  httpClient.get<UserFilePayload>(`/api/files/${id}`)

export const fetchUserFileVariantApi = (id: string, variant: FileVariant) =>
  httpClient.get<Blob>(`/api/files/${id}/${variant}`, { responseType: 'blob' })

export const deleteUserFileApi = (id: string) => httpClient.delete(`/api/files/${id}`)
