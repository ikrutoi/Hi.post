import { RootState } from '@app/state'

export const selectCardphoto = (state: RootState) => state.cardphoto
export const selectCardphotoUi = (state: RootState) => state.cardphoto.ui
