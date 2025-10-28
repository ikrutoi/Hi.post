import type { Template } from '@shared/config/constants'

export const trimLines = (source: Template, text: string): string => {
  const arrText = text
    .trim()
    .split(' ')
    .filter((word) => word !== '')
  let limitSingle = 0
  let limitAll = 0

  switch (source) {
    case 'cart':
    case 'drafts':
      limitSingle = 13
      limitAll = 15
      break
    case 'sender':
      limitSingle = 11
      limitAll = 22
      break
    case 'recipient':
      limitSingle = 15
      limitAll = 30
      break
  }

  const [first, second, third] = arrText

  if (first && first.length > limitSingle)
    return first.slice(0, limitSingle) + '...'
  if (arrText.length === 1) return first
  if (second) {
    const total = first.length + second.length
    if (total > limitAll || second.length > limitSingle) {
      return `${first} ${second.slice(0, limitSingle)}...`
    }
    if (arrText.length === 2) return `${first} ${second}`
  }
  if (third) {
    const total = first.length + second.length + third.length
    if (total > limitAll) {
      return `${first} ${second} ${third.slice(0, limitSingle)}...`
    }
    return `${first} ${second} ${third}`
  }

  return arrText.join(' ')
}
