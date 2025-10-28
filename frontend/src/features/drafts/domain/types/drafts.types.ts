export interface DraftsItem {
  localId: number
  id: string
  preview: string
  recipientName: string
}

export type Drafts = DraftsItem[]
