import type { EnvelopeItem } from './envelopeApi'

export interface EnvelopeState {
  items: EnvelopeItem[]
  loading: boolean
  error: string | null
}

export type EnvelopeStatus = 'new' | 'processing' | 'sent'
