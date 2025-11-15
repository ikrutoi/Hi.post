export interface DateLike {
  year: number
  month: number
  day: number
}

export const isSameDate = (
  a: DateLike | null | undefined,
  b: DateLike | null | undefined
): boolean => {
  return (
    !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day
  )
}
