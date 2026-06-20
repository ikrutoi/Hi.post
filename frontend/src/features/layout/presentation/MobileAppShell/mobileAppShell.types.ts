import type { RefObject } from 'react'
import type { CardLayer } from '@cardphoto/domain/types'
import type { RightSidebarKey } from '@toolbar/domain/types/rightSidebar.types'
import type { IconKey } from '@shared/config/constants'

export type MobileAppShellProps = {
  formRef: RefObject<HTMLDivElement | null>
  sizeCard: CardLayer
  onAppClick: (event: React.MouseEvent) => void
  pinActiveTab: Extract<RightSidebarKey, 'cart' | 'history'> | null
  activePieSide: 'left' | 'right'
  showTopCardStripFullSpan: boolean
  onBeforeLeftPieInteraction: () => void
  onLeftPieCenterClick: () => void
  hideSectionToolbar: boolean
  /** Mobile envelope: fullscreen address create/edit — hide chrome header and lift form. */
  envelopeAddressCreateMode?: boolean
  cardPieListPanelOpen: boolean
  onEditorPieToolbarAction?: (key: IconKey) => void | false
}
