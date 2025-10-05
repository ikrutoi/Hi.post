import type { Address } from '@envelope/domain/types'

export interface SectionPreset {
  id: string
  personalId?: string
  address?: Address
  cart?: {
    envelope: {
      recipient: {
        name: string
      }
    }
    date?: {
      year: number
      month: number
      day: number
    }
    cardphoto?: Blob
  }
  drafts?: {
    envelope: {
      recipient: {
        name: string
      }
    }
    cardphoto?: Blob
  }
}
