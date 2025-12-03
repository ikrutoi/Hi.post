import { useDateController } from '../controllers/useDateController'

export const useDateFacade = () => {
  const { state, actions } = useDateController()

  return {
    state: {
      selectedDate: state.selectedDate,
      isDateComplete: state.isDateComplete,
    },
    layout: {
      format: 'DD.MM.YYYY',
    },
    actions: {
      chooseDate: actions.chooseDate,
      clear: actions.clear,
    },
  }
}
