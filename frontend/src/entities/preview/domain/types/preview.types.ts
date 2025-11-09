export const FORMAT_PREVIEW = ['jpeg', 'png', 'webp'] as const

export type FormatPreview = (typeof FORMAT_PREVIEW)[number]
