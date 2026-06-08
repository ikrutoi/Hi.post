import { useAppDispatch } from '@app/hooks'
import type { CardSection } from '@shared/config/constants'

export const useMiniCardKebab = (section: CardSection) => {
  const dispatch = useAppDispatch()

  const handleClick = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()
  }

  return { handleClick }
}
