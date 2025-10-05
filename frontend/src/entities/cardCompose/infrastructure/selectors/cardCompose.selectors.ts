import { RootState } from '@app/state'

export const selectCardCompose = (state: RootState) => state.cardCompose

export const selectCardComposeIsComplete = (state: RootState): boolean => {
  const card = state.cardCompose
  return (
    card.cardphoto.isComplete &&
    card.cardtext.isComplete &&
    card.envelope.isComplete &&
    card.aroma.isComplete &&
    card.date.isComplete
  )
}
