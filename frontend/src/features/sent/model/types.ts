export interface SentPostcard {
  id: string
  preview: string
  recipientName: string
  date: string
  price: number
}

export type Sent = SentPostcard[]
