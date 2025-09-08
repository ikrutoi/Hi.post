export interface CurrentDate {
  currentYear: number
  currentMonth: number
  currentDay: number
  currentDayOfWeek: number
}

export const currentDate: CurrentDate = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  currentDay: new Date().getDate(),
  currentDayOfWeek: new Date().getDay(),
}
