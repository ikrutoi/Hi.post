import { useSwitcherController } from '../controllers'
import { useMemo } from 'react'

export const useSwitcherFacade = () => {
  const { state, actions } = useSwitcherController()

  const isMonthActive = useMemo(
    () => state.activeSwitcher === 'month',
    [state.activeSwitcher]
  )
  const isYearActive = useMemo(
    () => state.activeSwitcher === 'year',
    [state.activeSwitcher]
  )

  return {
    state: {
      activeSwitcher: state.activeSwitcher,
      isMonthActive,
      isYearActive,
    },
    actions: {
      setActiveSwitcher: actions.setActiveSwitcher,
      toggleActiveSwitcher: actions.toggleActiveSwitcher,
      resetActiveSwitcher: actions.resetActiveSwitcher,
    },
  }
}
