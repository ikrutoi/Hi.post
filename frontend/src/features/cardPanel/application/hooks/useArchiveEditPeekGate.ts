import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import {
  isMirrorCardtextHydratedInEditor,
  isMirrorSectionAppliedToEditor,
} from '@cardPanel/application/helpers/mirrorSectionEditorSync'
import type { CardPanelSection } from '@cardPanel/domain/types'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectCardphotoAppliedData } from '@cardphoto/infrastructure/selectors'
import { selectCardtextState } from '@cardtext/infrastructure/selectors'
import { selectAppliedRecipientDisplayAddress } from '@envelope/recipient/infrastructure/selectors'
import { selectAppliedSenderDisplayAddress } from '@envelope/sender/infrastructure/selectors'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { selectSelectedDates } from '@date/infrastructure/selectors'

/**
 * Пока cardPieEdit гидратит session из выбранной строки корзины/истории,
 * держим упрощённый peek вместо редактора (без пустой/старой формы).
 */
export function useArchiveEditPeekGate(section: CardPanelSection): boolean {
  const {
    activePieSide,
    cardPieEditEngaged,
    listRowInner,
    listRowLocalId,
  } = useRightListArchiveMini()

  const cartItems = useAppSelector(selectCartItems)
  const cardphotoAppliedData = useAppSelector(selectCardphotoAppliedData)
  const cardtextState = useAppSelector(selectCardtextState)
  const appliedRecipientAddress = useAppSelector(
    selectAppliedRecipientDisplayAddress,
  )
  const appliedSenderAddress = useAppSelector(selectAppliedSenderDisplayAddress)
  const selectedAroma = useAppSelector(selectSelectedAroma)
  const selectedDates = useAppSelector(selectSelectedDates)

  return useMemo(() => {
    if (!cardPieEditEngaged || activePieSide !== 'right') return false
    if (listRowInner == null || listRowLocalId == null) return false

    const sourcePostcard =
      cartItems.find((p) => p.localId === listRowLocalId) ?? null

    /**
     * postcardEdit снимает appliedData, но assetData уже гидратирован.
     * Gate должен отпустить peek, чтобы CardtextSessionEditor отдал cardtextView в нижний ряд.
     */
    if (section === 'cardtext') {
      const session =
        cardtextState?.appliedData ?? cardtextState?.assetData ?? null
      return !isMirrorCardtextHydratedInEditor(listRowInner, session)
    }

    return !isMirrorSectionAppliedToEditor(
      section,
      listRowInner,
      sourcePostcard,
      {
        cardphotoAppliedData,
        cardtextApplied: cardtextState?.appliedData ?? null,
        appliedRecipientAddress,
        appliedSenderAddress,
        selectedAroma,
        selectedDates,
      },
    )
  }, [
    section,
    cardPieEditEngaged,
    activePieSide,
    listRowInner,
    listRowLocalId,
    cartItems,
    cardphotoAppliedData,
    cardtextState?.appliedData,
    cardtextState?.assetData,
    appliedRecipientAddress,
    appliedSenderAddress,
    selectedAroma,
    selectedDates,
  ])
}
