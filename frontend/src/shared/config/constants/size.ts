export const VIEWPORT_SIZE = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export type ViewportSize = (typeof VIEWPORT_SIZE)[number]
