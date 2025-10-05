export type ImageStage = 'original' | 'crop'

export type ImageVersion = {
  idImage: string
  image: Blob
  stage: ImageStage
  url: string | null
  timestamp: number
}

export type ImageHistory = {
  stockImages: ImageVersion[]
  userImages: ImageVersion[]
  activeBranch: 'stock' | 'user'
  activeIndex: number
}
