export type PostcardStatus = 'drafts' | 'cart' | 'sent'

export interface CardPhoto {
  url: string
  alt?: string
}

export interface CardText {
  message: string
  font?: string
}

export interface Envelope {
  color: string
  pattern?: string
}

export interface Aroma {
  type: string
  intensity?: number
}

export interface DeliveryDate {
  scheduled: string // ISO
}

export interface PostcardBase {
  id: string
  personalId: string
  status: PostcardStatus
  price?: number

  cardPhoto?: CardPhoto
  cardText?: CardText
  envelope?: Envelope
  aroma?: Aroma
  date?: DeliveryDate

  createdAt?: string
  updatedAt?: string
  metadata?: Record<string, unknown>
}

export interface PostcardDraft extends PostcardBase {
  status: 'drafts'
  date?: undefined
}

export interface PostcardCart extends PostcardBase {
  status: 'cart'
  price: number
  date: DeliveryDate
}

export interface PostcardSent extends PostcardBase {
  status: 'sent'
  sentAt: string
}
