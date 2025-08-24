export interface SelectedDate {
  year: number
  month: number
}

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

let yearForCurrentDaysInMonth: number
let monthForCurrentDaysInMonth: number

if (currentDate.currentMonth !== 11) {
  monthForCurrentDaysInMonth = currentDate.currentMonth + 1
  yearForCurrentDaysInMonth = currentDate.currentYear
} else {
  monthForCurrentDaysInMonth = 0
  yearForCurrentDaysInMonth = currentDate.currentYear + 1
}

export const daysInCurrentMonth: number = new Date(
  yearForCurrentDaysInMonth,
  monthForCurrentDaysInMonth,
  0
).getDate()
