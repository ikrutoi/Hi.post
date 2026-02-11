import type { CardState, CalendarCardItem } from '../../domain/types'

export const rebuildIndex = (state: CardState) => {
  state.calendarIndex.cart = []
  state.calendarIndex.ready = []
  state.calendarIndex.sent = []
  state.calendarIndex.delivered = []
  state.calendarIndex.error = []

  state.cards.forEach((card) => {
    if (card.status === 'drafts' || card.status === 'processed') return

    const item: CalendarCardItem = {
      cardId: card.id,
      date: card.date,
      previewUrl: card.thumbnailUrl,
      status: card.status,
    }

    switch (card.status) {
      case 'cart':
        state.calendarIndex.cart.push(item)
        break
      case 'ready':
        state.calendarIndex.ready.push(item)
        break
      case 'sent':
        state.calendarIndex.sent.push(item)
        break
      case 'delivered':
        state.calendarIndex.delivered.push(item)
        break
      case 'error':
        state.calendarIndex.error.push(item)
        break
    }
  })
}
