import { useDateController } from '../controllers'

export const useDateFacade = () => {
  const {
    state: { dispatchDate, dispatchDateTitle, activeDateTitleRole },
    actions: {
      setDispatchDate,
      setDispatchDateTitle,
      setActiveDateTitleRole,
      toggleActiveDateRole,
      updateDateTitleField,
      goToTodayDate,
      goToSelectedDate,
      handleCalendarCellClick,
      handleDecrementArrow,
      handleIncrementArrow,
      handleSliderChange,
      handleDispatchDate,
    },
    derived: { isCurrentMonth },
  } = useDateController()

  return {
    state: {
      dispatchDate,
      dispatchDateTitle,
      activeDateTitleRole,
      isCurrentMonth,
    },
    actions: {
      setDispatchDate,
      setDispatchDateTitle,
      setActiveDateTitleRole,
      toggleActiveDateRole,
      updateDateTitleField,
      goToTodayDate,
      goToSelectedDate,
      handleCalendarCellClick,
      handleDecrementArrow,
      handleIncrementArrow,
      handleSliderChange,
      handleDispatchDate,
    },
    derived: {
      isCurrentMonth,
    },
  }
}
