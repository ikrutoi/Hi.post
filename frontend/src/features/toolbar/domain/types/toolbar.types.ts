import type { ReactEditor } from 'slate-react'
import type { AppDispatch } from '@app/state'
import type { IconKey, IconState } from '@shared/config/constants'
import type {
  CardtextKey,
  CardtextToolbarState,
  CardphotoKey,
  EnvelopeKey,
  PanelKey,
  CardPanelOverlayToolbarKey,
} from './index'

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
  sender: EnvelopeToolbarState
  recipient: EnvelopeToolbarState
  cardPanel: CardPanelToolbarState
  cardPanelOverlay: CardPanelOverlayToolbarState
}

export type UpdateSectionPayload<K extends keyof ToolbarState> = {
  section: K
  value: Partial<ToolbarState[K]>
}

export interface BaseSectionConfig<
  TState,
  TKey,
  TSection extends ToolbarSection,
> {
  keys: ReadonlyArray<TKey>
  initialState: TState
  onAction: (
    key: TKey,
    section: TSection,
    editor: ReactEditor,
    dispatch: AppDispatch
  ) => void
  group: string
  toolbar?: ToolbarConfig
  getBadges?: (state: TState) => Record<string, number | null>
}

export type ToolbarSectionConfigMap = {
  cardphoto: BaseSectionConfig<CardphotoToolbarState, CardphotoKey, 'cardphoto'>
  cardtext: BaseSectionConfig<CardtextToolbarState, CardtextKey, 'cardtext'>
  sender: BaseSectionConfig<EnvelopeToolbarState, EnvelopeKey, 'sender'>
  recipient: BaseSectionConfig<EnvelopeToolbarState, EnvelopeKey, 'recipient'>
  cardPanel: BaseSectionConfig<CardPanelToolbarState, PanelKey, 'cardPanel'>
  cardPanelOverlay: BaseSectionConfig<
    CardPanelOverlayToolbarState,
    CardPanelOverlayToolbarKey,
    'cardPanelOverlay'
  >
}

export type ToolbarKeyFor<S extends ToolbarSection> = S extends 'cardphoto'
  ? CardphotoKey
  : S extends 'cardtext'
    ? CardtextKey
    : S extends 'sender'
      ? EnvelopeKey
      : S extends 'recipient'
        ? EnvelopeKey
        : S extends 'cardPanel'
          ? PanelKey
          : S extends 'cardPanelOverlay'
            ? CardPanelOverlayToolbarKey
            : never
