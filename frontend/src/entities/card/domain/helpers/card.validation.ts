import { Card, CardStatus, CARD_SECTIONS } from '../../domain/types'

export function isCardValidForStatus(card: Card, status: CardStatus): boolean {
  const allSectionsComplete = CARD_SECTIONS.every((s) => card[s].isComplete)

  switch (status) {
    case 'drafts':
      return (
        allSectionsComplete && card.date.isComplete && card.date.data === null
      )
    case 'saved':
    case 'trash':
      return (
        allSectionsComplete && card.date.isComplete && card.date.data !== null
      )
    case 'inProgress':
      return true
    default:
      return false
  }
}
