import type { RefObject } from 'react'
import { Cardphoto } from '@cardphoto/presentation/Cardphoto'
import { Cardtext } from '@cardtext/presentation/Cardtext'
import { Envelope } from '@envelope/presentation/Envelope'
import { Aroma } from '@aroma/presentation/Aroma'
import { Date } from '@date/presentation/Date'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import type { CardMenuSection } from '@shared/config/constants'

export const renderCardSection = (
  section: CardMenuSection | null,
  options: {
    sectionLeft: number
    sectionRef: RefObject<HTMLDivElement | null>
    /** Согласовано с Redux (`calendar.notebookStripTab`) и сагой синхронизации. */
    notebookStripTab: DateStripSection
  },
) => {
  const { sectionLeft, sectionRef, notebookStripTab } = options

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
      return <Date section={notebookStripTab} />
    case 'history':
      return <Date section="history" />
    default:
      return null
  }
}
