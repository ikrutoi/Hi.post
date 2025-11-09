import type { ViewportSize } from './size'

export const PREVIEW_IMAGE_SIZE_MAP: Record<
  ViewportSize,
  { width: number; height: number }
> = {
  xs: { width: 60, height: 42 },
  sm: { width: 80, height: 56 },
  md: { width: 100, height: 70 },
  lg: { width: 120, height: 85 },
  xl: { width: 140, height: 99 },
}
