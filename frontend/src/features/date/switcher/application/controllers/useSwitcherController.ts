import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { RootState } from '@app/state'
import { togglePosition, setPosition } from '../../infrastructure/state'
import {
  selectSwitcher,
  selectSwitcherPosition,
} from '../../infrastructure/selectors'

export const useSwitcherController = () => {
  const dispatch = useAppDispatch()

  const switcher = useAppSelector((state: RootState) => selectSwitcher(state))
  const position = useAppSelector((state: RootState) =>
    selectSwitcherPosition(state),
  )

  const toggle = () => dispatch(togglePosition())
  const changePosition = (pos: 'month' | 'year') => dispatch(setPosition(pos))

  return {
    switcher,
    position,
    toggle,
    changePosition,
  }
}
