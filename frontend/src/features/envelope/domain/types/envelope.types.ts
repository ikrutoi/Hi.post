import type { SenderState } from './sender.types'
import type { RecipientState } from '../../recipient/domain/types'

export interface EnvelopeSessionRecord {
  sender: SenderState
  recipient: RecipientState
  isComplete: boolean
}

export type { RecipientView } from '../../recipient/domain/types'
export type { RecipientState } from '../../recipient/domain/types'
