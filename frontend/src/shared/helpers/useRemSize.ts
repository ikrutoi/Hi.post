import { useAppSelector } from '@app/hooks'
import { selectRemSize } from '@/features/layout/infrastructure/selectors'

export const useRemSize = (fallback = 16) => {
  const remSize = useAppSelector(selectRemSize)
  return remSize ?? fallback
}
