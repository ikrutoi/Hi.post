import type { FirstDayOfWeekPreference } from '@entities/date/domain/types'

const STORAGE_KEY = 'hi.post.date.firstDayOfWeek'

export function readStoredFirstDayOfWeek(): FirstDayOfWeekPreference {
  if (typeof window === 'undefined') return 'Sun'
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === 'Mon' || raw === 'Sun') return raw
  } catch {
    /* private mode / denied */
  }
  return 'Sun'
}

export function writeStoredFirstDayOfWeek(
  value: FirstDayOfWeekPreference,
): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* ignore quota / denied */
  }
}
