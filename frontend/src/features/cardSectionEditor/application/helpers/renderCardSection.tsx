import type { RefObject } from 'react'
import { Cardphoto } from '@cardphoto/presentation/Cardphoto'
import { Cardtext } from '@cardtext/presentation/Cardtext'
import { Envelope } from '@envelope/presentation/Envelope'
import { Aroma } from '@aroma/presentation/Aroma'
import { Date } from '@date/presentation/Date'
import type { CardMenuSection } from '@shared/config/constants'

export const renderCardSection = (
  section: CardMenuSection | null,
  options: {
    sectionLeft: number
    sectionRef: RefObject<HTMLDivElement | null>
    /** Right cart list open: Date strip uses calendar Cart mode. */
    cartListPanelOpen?: boolean
    /** Right history list open: Date strip uses calendar History mode (как при корзине + пирог). */
    historyListPanelOpen?: boolean
  },
) => {
  const {
    sectionLeft,
    sectionRef,
    cartListPanelOpen = false,
    historyListPanelOpen = false,
  } = options

  const dateStripSection =
    cartListPanelOpen ? 'cart' : historyListPanelOpen ? 'history' : 'date'

  switch (section) {
    case 'cardphoto':
      return <Cardphoto />
    case 'cardtext':
      return <Cardtext styleLeft={sectionLeft ?? 0} />
    case 'envelope':
      return <Envelope cardPuzzleRef={sectionRef} />
    case 'aroma':
      return <Aroma />
    case 'date':
      return <Date section={dateStripSection} />
    case 'history':
      return <Date section="history" />
    default:
      return null
  }
}
