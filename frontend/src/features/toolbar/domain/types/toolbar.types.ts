import type { IconKey, IconState } from '@shared/config/constants'
import type {
  CardtextKey,
  CardtextToolbarState,
  CardtextSectionConfig,
} from './cardtext.types'
import type {
  CardphotoKey,
  CardphotoToolbarState,
  CardphotoSectionConfig,
} from './cardphoto.types'
import type {
  PanelKey,
  CardPanelToolbarState,
  CardPanelSectionConfig,
} from './cardPanel.types'
import type {
  CardPanelOverlayToolbarKey,
  CardPanelOverlayToolbarState,
  CardPanelOverlaySectionConfig,
} from './cardPanelOverlay.types'
import type {
  EnvelopeKey,
  AddressState,
  EnvelopeSectionConfig,
} from './envelope.types'

export interface ToolbarIcon {
  key: IconKey
  state: IconState
}

export interface ToolbarGroup {
  group: string
  icons: ToolbarIcon[]
}

export type ToolbarConfig = ToolbarGroup[]

export const TOOLBAR_SECTIONS = [
  'cardphoto',
  'cardtext',
  'sender',
  'recipient',
  'cardPanel',
  'cardPanelOverlay',
] as const

export type ToolbarSection = (typeof TOOLBAR_SECTIONS)[number]

export type ToolbarState = {
  cardphoto: CardphotoToolbarState
  cardtext: CardtextToolbarState
  sender: AddressState
  recipient: AddressState
  cardPanel: CardPanelToolbarState
  cardPanelOverlay: CardPanelOverlayToolbarState
}

export type ToolbarKeyFor<S extends ToolbarSection> = S extends 'cardphoto'
  ? CardphotoKey
  : S extends 'cardtext'
    ? CardtextKey
    : S extends 'sender' | 'recipient'
      ? EnvelopeKey
      : S extends 'cardPanel'
        ? PanelKey
        : S extends 'cardPanelOverlay'
          ? CardPanelOverlayToolbarKey
          : never

export interface ToolbarSectionConfig<S extends ToolbarSection> {
  keys: ReadonlyArray<keyof ToolbarState[S]>
  initialState: ToolbarState[S]
  onAction: (key: keyof ToolbarState[S], section: S) => void
  getBadges?: (state: ToolbarState[S]) => Record<string, number | null>
}

export interface BaseSectionConfig<
  TState,
  TKey,
  TSection extends ToolbarSection,
> {
  keys: ReadonlyArray<TKey>
  initialState: TState
  onAction: (key: TKey, section: TSection) => void
  group: string
  toolbar?: ToolbarConfig
  getBadges?: (state: TState) => Record<string, number | null>
}

export type ToolbarSectionConfigMap = {
  cardphoto: CardphotoSectionConfig
  cardtext: CardtextSectionConfig
  sender: EnvelopeSectionConfig
  recipient: EnvelopeSectionConfig
  cardPanel: CardPanelSectionConfig
  cardPanelOverlay: CardPanelOverlaySectionConfig
}
