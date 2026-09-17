import type { RecipientState } from '@envelope/recipient/domain/types'

/**
 * Dual-mode: right cart/history envelope edits live here — never in assembly
 * session `recipient` slice. Apply persists to the postcard by localId.
 */
export type ArchiveEnvelopeSandboxState = {
  localId: number | null
  source: 'cart' | 'history' | null
  recipient: RecipientState
}
