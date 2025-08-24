export type ImageBase = 'stockImages' | 'userImages'

export interface ImageMeta {
  source: string | null
  url: string | null
  base: 'stockImages' | 'userImages' | null
}
