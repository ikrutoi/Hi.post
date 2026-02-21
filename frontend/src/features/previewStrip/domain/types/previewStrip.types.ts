/**
 * Элемент полосы «последние N» в правой панели тулбара.
 * Один тип списка для картинок, текстов и адресов; различается по kind.
 */
export type PreviewStripItem =
  | {
      kind: 'cardphoto'
      id: string
      /** id картинки (asset/crop) для CropPreviewItem */
      imageId: string
      /** Для сортировки: время последнего изменения (timestamp) */
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
      /** sender | recipient */
      addressType: 'sender' | 'recipient'
      name: string
      updatedAt: number
    }

export type PreviewStripSection = 'cardphoto' | 'cardtext' | 'envelope'
