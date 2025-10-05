import { useAppDispatch } from '@app/hooks'
import type { StatusType } from '../../domain/types'

export const handleToolbarClick = (
  evt: React.MouseEvent<HTMLButtonElement>,
  status: StatusType
): void => {
  const dispatch = useAppDispatch()

  const btn = (evt.target as HTMLElement).closest(
    '.toolbar-btn'
  ) as HTMLButtonElement
  const tooltip = btn?.dataset.tooltip as 'cart' | 'clip' | 'user' | undefined
  if (!tooltip) return

  switch (tooltip) {
    case 'cart':
      dispatch({
        type: 'layout/setChoiceClip',
        payload: status.cart ? null : 'cart',
      })
      break
    case 'clip':
    case 'user':
      dispatch({
        type: 'layout/setChoiceClip',
        payload: status.clip ? null : 'drafts',
      })
      break
  }
}
