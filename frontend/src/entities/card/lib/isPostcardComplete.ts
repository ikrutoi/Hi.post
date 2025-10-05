import { PostcardBase } from '../model/card.types'

export function isPostcardComplete(postcard: PostcardBase): boolean {
  const requiredFields = [
    postcard.cardPhoto,
    postcard.cardText,
    postcard.envelope,
    postcard.aroma,
    postcard.date,
  ]

  return requiredFields.every((field) => field && Object.keys(field).length > 0)
}
