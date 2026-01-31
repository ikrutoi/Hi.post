import type { ReactEditor } from 'slate-react'
import type { AppDispatch } from '@app/state'
import type {
  IconKey,
  IconState,
  IconStateGroup,
  // IconValue,
} from '@shared/config/constants'
import type {
  CardphotoKey,
  CardphotoToolbarState,
  CardtextKey,
  CardtextToolbarState,
  EnvelopeToolbarState,
  EnvelopeKey,
  PanelKey,
  CardPanelToolbarState,
  CardPanelOverlayToolbarKey,
  CardPanelOverlayToolbarState,
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
} from './index'
import type { LayoutOrientation } from '@layout/domain/types'

export type IconOptions = {
  badge?: number | null
  orientation?: LayoutOrientation
}
export interface ToolbarIcon {
  key: IconKey
  state: IconState
  options?: IconOptions
}

export interface ToolbarGroup {
  group: string
  icons: ToolbarIcon[]
  status: IconState
}

export type ToolbarConfig = ToolbarGroup[]

export const TOOLBAR_SECTIONS = [
  'cardphoto',
  'cardtext',
  'sender',
  'recipient',
  'cardPanel',
  'cardPanelOverlay',
  'sectionEditorMenu',
] as const

export type ToolbarSection = (typeof TOOLBAR_SECTIONS)[number]

export type ToolbarState = {
  cardphoto: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardtext: CardtextToolbarState & { config: ToolbarGroup[] }
  sender: EnvelopeToolbarState & { config: ToolbarGroup[] }
  recipient: EnvelopeToolbarState & { config: ToolbarGroup[] }
  cardPanel: CardPanelToolbarState & { config: ToolbarGroup[] }
  cardPanelOverlay: CardPanelOverlayToolbarState & { config: ToolbarGroup[] }
  sectionEditorMenu: SectionEditorMenuToolbarState & { config: ToolbarGroup[] }
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
    dispatch: AppDispatch,
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
  sectionEditorMenu: BaseSectionConfig<
    SectionEditorMenuToolbarState,
    SectionEditorMenuKey,
    'sectionEditorMenu'
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
            : S extends 'sectionEditorMenu'
              ? SectionEditorMenuKey
              : never
