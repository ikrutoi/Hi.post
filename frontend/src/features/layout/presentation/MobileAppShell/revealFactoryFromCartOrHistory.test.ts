import { describe, expect, it } from 'vitest'
import { isCartOrHistoryArchiveActive } from './revealFactoryFromCartOrHistory'

describe('isCartOrHistoryArchiveActive', () => {
  it('is true when the cart list is open', () => {
    expect(
      isCartOrHistoryArchiveActive({
        cartListPanelOpen: true,
        historyListPanelOpen: false,
        notebookStripTab: 'date',
      }),
    ).toBe(true)
  })

  it('is true on the cart or history strip', () => {
    expect(
      isCartOrHistoryArchiveActive({
        cartListPanelOpen: false,
        historyListPanelOpen: false,
        notebookStripTab: 'cart',
      }),
    ).toBe(true)
    expect(
      isCartOrHistoryArchiveActive({
        cartListPanelOpen: false,
        historyListPanelOpen: false,
        notebookStripTab: 'history',
      }),
    ).toBe(true)
  })

  it('is false on the date factory', () => {
    expect(
      isCartOrHistoryArchiveActive({
        cartListPanelOpen: false,
        historyListPanelOpen: false,
        notebookStripTab: 'date',
      }),
    ).toBe(false)
  })
})
