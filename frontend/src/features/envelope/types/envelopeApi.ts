export interface EnvelopeItem {
  id: string
  address: string
  sender: string
  receivedAt: string
}

export interface FetchEnvelopesResponse {
  items: EnvelopeItem[]
}

export interface CreateEnvelopePayload {
  address: string
  sender: string
}
