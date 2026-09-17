import type { RecipientState } from '../../recipient/domain/types'

export interface EnvelopeSessionRecord {
  recipient: RecipientState
  isComplete: boolean
}

export type { RecipientView } from '../../recipient/domain/types'
export type { RecipientState } from '../../recipient/domain/types'
