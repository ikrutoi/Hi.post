import type { CardMenuSection, Template } from '@shared/config/constants'

export type CardMenuNav = {
  selectedCardMenuSection: CardMenuSection | null
}

export type TemplateNav = {
  selectedTemplate: Template | null
}

export interface LayoutNavState {
  layoutCardNav: CardMenuNav
  layoutTemplate: TemplateNav
}
