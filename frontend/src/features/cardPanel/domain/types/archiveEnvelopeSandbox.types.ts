import type { RecipientState } from '@envelope/recipient/domain/types'
import type { SenderState } from '@envelope/sender/domain/types'

/**
 * Dual-mode: right cart/history envelope edits live here — never in assembly
 * session `sender` / `recipient` slices. Apply persists to the postcard by localId.
 */
export type ArchiveEnvelopeSandboxState = {
  localId: number | null
  source: 'cart' | 'history' | null
  sender: SenderState
  recipient: RecipientState
}
