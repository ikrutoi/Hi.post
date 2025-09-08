import type { SizeCard } from '@features/layout/domain/layoutTypes'

export const calculateSizeCard = (height: number, scale: number): SizeCard => ({
  height: Number((height * scale).toFixed(2)),
  width: Number((height * scale * 1.42).toFixed(2)),
})
