export interface CardPanelHandlers {
  handleClickMiniKebab(section: string, id: string): Promise<void>
  handleClickCardtext(id: string): void
  handleClickIconArrows(): Promise<void>
  handleIconFullCardClick(action: 'addCart' | 'save' | 'remove'): Promise<void>
  updateDuplicateButtons(): Promise<void>
}
