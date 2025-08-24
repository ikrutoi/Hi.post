import { ParsedDate } from '@shared/types'

export const parseDateString = (date: string): ParsedDate => {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day }
}
