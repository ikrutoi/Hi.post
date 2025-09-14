import type { RootState } from '@app/state/store'

export const selectCardphoto = (state: RootState) =>
  state.cardEditor.cardphoto.value
export const selectCardphotoUrl = (state: RootState) =>
  state.cardEditor.cardphoto.value.url
export const selectCardphotoSource = (state: RootState) =>
  state.cardEditor.cardphoto.value.source
