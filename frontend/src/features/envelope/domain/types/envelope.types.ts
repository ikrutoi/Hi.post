import type { SenderState } from '../../sender/domain/types'
import type { RecipientState } from '../../recipient/domain/types'

export type RecipientMode = 'recipient' | 'recipients'

export interface EnvelopeSessionRecord {
  sender: SenderState
  recipient: RecipientState
  isComplete: boolean
}

export type { SenderView } from '../../sender/domain/types'

export type { RecipientView } from '../../recipient/domain/types'

export type { SenderState } from '../../sender/domain/types'
export type { RecipientState } from '../../recipient/domain/types'
