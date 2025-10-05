export const getCurrentDate = () => {
  const now = new Date()
  return {
    currentYear: now.getFullYear(),
    currentMonth: now.getMonth(),
    currentDay: now.getDate(),
    currentDayOfWeek: now.getDay(),
  }
}
