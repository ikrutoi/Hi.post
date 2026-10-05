import { useMemo, useRef } from 'react'
import { useAppSelector } from '@app/hooks'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import {
  isMirrorCardphotoHydratedInEditor,
  isMirrorCardtextHydratedInEditor,
  isMirrorSectionAppliedToEditor,
} from '@cardPanel/application/helpers/mirrorSectionEditorSync'
import type { CardPanelSection } from '@cardPanel/domain/types'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  selectCardphotoAppliedData,
  selectCardphotoAssetData,
} from '@cardphoto/infrastructure/selectors'
import { selectCardtextState } from '@cardtext/infrastructure/selectors'
import { selectAppliedRecipientDisplayAddress } from '@envelope/recipient/infrastructure/selectors'
import { selectAppliedSenderDisplayAddress } from '@envelope/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveEnvelopeSandboxLocalId,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { selectAppliedDates } from '@date/infrastructure/selectors'

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
    listRowPostcardStatus,
    mirrorListArchiveSource,
  } = useRightListArchiveMini()

  const cartItems = useAppSelector(selectCartItems)
  const cardphotoAppliedData = useAppSelector(selectCardphotoAppliedData)
  const cardphotoAssetData = useAppSelector(selectCardphotoAssetData)
  const cardtextState = useAppSelector(selectCardtextState)
  const appliedRecipientAddress = useAppSelector(
    selectAppliedRecipientDisplayAddress,
  )
  const appliedSenderAddress = useAppSelector(selectAppliedSenderDisplayAddress)
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxLocalId = useAppSelector(selectArchiveEnvelopeSandboxLocalId)
  const selectedAroma = useAppSelector(selectSelectedAroma)
  const selectedDates = useAppSelector(selectAppliedDates)
  /**
   * postcardEdit кардфото: peek только до первой гидратации.
   * Выбор другого шаблона меняет asset и не должен снова закрывать редактор.
   */
  const cardphotoEditReleasedRowRef = useRef<number | null>(null)
  if (!cardPieEditEngaged || listRowLocalId == null) {
    cardphotoEditReleasedRowRef.current = null
  } else if (section === 'cardphoto') {
    if (
      cardphotoEditReleasedRowRef.current != null &&
      cardphotoEditReleasedRowRef.current !== listRowLocalId
    ) {
      cardphotoEditReleasedRowRef.current = null
    }
    if (cardphotoEditReleasedRowRef.current == null) {
      const sourcePostcard =
        cartItems.find((p) => p.localId === listRowLocalId) ?? null
      const sourceMeta =
        sourcePostcard?.card.cardphoto?.appliedData ??
        sourcePostcard?.card.cardphoto?.assetData ??
        null
      const hydrated = isMirrorCardphotoHydratedInEditor(
        sourcePostcard,
        cardphotoAssetData,
      )
      const noSourcePhoto = sourceMeta?.id == null
      if (hydrated || (noSourcePhoto && cardphotoAssetData?.id != null)) {
        cardphotoEditReleasedRowRef.current = listRowLocalId
      }
    }
  }

  return useMemo(() => {
    if (!cardPieEditEngaged || activePieSide !== 'right') return false
    if (listRowInner == null || listRowLocalId == null) return false

    const sourcePostcard =
      cartItems.find((p) => p.localId === listRowLocalId) ?? null

    /**
     * postcardEdit / cardPieEdit снимают appliedData, но assetData уже гидратирован.
     * Gate должен отпустить peek, чтобы session-редактор отдал обычные тулбары.
     */
    if (section === 'cardtext') {
      const session =
        cardtextState?.appliedData ?? cardtextState?.assetData ?? null
      return !isMirrorCardtextHydratedInEditor(listRowInner, session)
    }

    if (section === 'cardphoto') {
      if (cardphotoEditReleasedRowRef.current === listRowLocalId) return false
      return !isMirrorCardphotoHydratedInEditor(
        sourcePostcard,
        cardphotoAssetData,
      )
    }

    /**
     * Cart envelope: data is in archiveEnvelopeSandbox (not assembly session).
     * Hold peek only until sandbox for this row is loaded — do not require
     * appliedData match (postcardEdit clears apply into viewDraft).
     */
    if (section === 'envelope') {
      const expectsCartSandbox =
        mirrorListArchiveSource === 'cart' ||
        listRowPostcardStatus === 'cart' ||
        listRowPostcardStatus === 'cartBlocked'
      if (expectsCartSandbox) {
        return !(sandboxActive && sandboxLocalId === listRowLocalId)
      }
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
    listRowPostcardStatus,
    mirrorListArchiveSource,
    cartItems,
    cardphotoAppliedData,
    cardphotoAssetData,
    cardtextState?.appliedData,
    cardtextState?.assetData,
    appliedRecipientAddress,
    appliedSenderAddress,
    sandboxActive,
    sandboxLocalId,
    selectedAroma,
    selectedDates,
  ])
}
