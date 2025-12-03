export const getCurrentDate = () => {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
    dayOfWeek: now.getDay(),
  }
}
