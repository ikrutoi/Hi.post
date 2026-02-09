import { useSwitcherController } from '../controllers'
// import {
//   selectSwitcher,
//   selectSwitcherPosition,
// } from '../../infrastructure/selectors'
// import { togglePosition, setPosition } from '../../infrastructure/state'

export const useSwitcherFacade = () => {
  const { position, toggle, changePosition } = useSwitcherController()

  return {
    state: { position },
    actions: {
      toggle,
      changePosition,
    },
  }
}
