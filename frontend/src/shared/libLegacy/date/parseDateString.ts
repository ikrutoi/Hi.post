import { ParsedDate } from '@shared/typesLegacy'

export const parseDateString = (date: string): ParsedDate => {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day }
}
