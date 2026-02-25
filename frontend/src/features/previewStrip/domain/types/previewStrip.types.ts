export type PreviewStripItem =
  | {
      kind: 'cardphoto'
      id: string
      imageId: string
      updatedAt: number
    }
  | {
      kind: 'cardtext'
      id: string
      templateId: string
      plainText: string
      updatedAt: number
    }
  | {
      kind: 'address'
      id: string
      templateId: string
      addressType: 'sender' | 'recipient'
      name: string
      updatedAt: number
    }

export type PreviewStripSection = 'cardphoto' | 'cardtext' | 'envelope'
