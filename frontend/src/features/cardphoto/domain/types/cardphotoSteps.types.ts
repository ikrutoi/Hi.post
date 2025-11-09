export const IMAGE_STORE = ['stockImages', 'userImages'] as const

export type ImageStore = (typeof IMAGE_STORE)[number]

export const IMAGE_STEP = ['originalImage', 'workingImage'] as const

export type ImageStep = (typeof IMAGE_STEP)[number]

export interface CardphotoItem {
  store: ImageStore
  step: ImageStep
  url: Blob
}

export interface CardphotoSteps {
  steps: CardphotoItem[]
  currentStepIndex: number
}
