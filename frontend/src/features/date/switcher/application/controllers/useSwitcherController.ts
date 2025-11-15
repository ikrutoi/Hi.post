// @features/switcher/model/controller.ts
import { useSelector, useDispatch } from 'react-redux'
import { selectActiveSwitcher } from '../../infrastructure/selectors'
import {
  setSwitcher,
  toggleSwitcher,
  resetSwitcher,
} from '../../infrastructure/state'
import type { Switcher, VisibleCalendarDate } from '@entities/date/domain/types'

export const useSwitcherController = () => {
  const dispatch = useDispatch()
  const activeSwitcher = useSelector(selectActiveSwitcher)

  const setActiveSwitcher = (part: Switcher) => {
    dispatch(setSwitcher(part))
  }

  const toggleActiveSwitcher = (part: VisibleCalendarDate) => {
    dispatch(toggleSwitcher(part))
  }

  const resetActiveSwitcher = () => {
    dispatch(resetSwitcher())
  }

  return {
    state: {
      activeSwitcher,
    },
    actions: {
      setActiveSwitcher,
      toggleActiveSwitcher,
      resetActiveSwitcher,
    },
  }
}
