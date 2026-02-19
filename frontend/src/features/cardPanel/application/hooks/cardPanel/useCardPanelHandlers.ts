import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { getResultCardphoto } from '@cardPanel/utils/getResultCardphoto'
import { getDuplicateSummary } from '@cardPanel/domain/logic'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { useDateFacade } from '@date/application/facades'
import { useAromaFacade } from '@aroma/application/facades'
import {
  setFullCard,
  setChoiceMemorySection,
  setActiveSections,
  addChoiceSection,
  setFullCardPersonalId,
  addIndexDb,
} from '@store/slices/layoutSlice'
import type { CardItem } from '@entities/card/domain/types'
import type {
  CardPanelHandlers,
  CardPanelState,
  CardPanelDb,
  // CardActionsState,
} from '@cardPanel/domain/types'

export const useCardPanelHandlers = (
  state: CardPanelState,
  db: CardPanelDb
): CardPanelHandlers => {
  const dispatch = useDispatch()

  const { reset: resetCardtext } = useCardtextFacade()

  const { actions: actionsEnvelope } = useEnvelopeFacade()
  const { resetEnvelope } = actionsEnvelope.store

  const { clear: resetDate } = useDateFacade()

  const { actions: actionsAroma } = useAromaFacade()
  const { resetAroma } = actionsAroma

  const handleClickMiniKebab = async (section: string, id: string) => {
    switch (section) {
      case 'cardtext':
        await db.deleteCardtextById(id)
        break
      case 'aroma':
        resetAroma()
        break
    }
  }

  const handleClickCardtext = (id: string) => {
    dispatch(setChoiceMemorySection({ section: 'cardtext', id }))
  }

  const handleClickIconArrows = async () => {
    state.setMinimize((prev) => !prev)
    await updateDuplicateButtons()
    if (state.selectedTemplate.source !== 'minimize') {
      dispatch(
        addChoiceSection({ source: 'minimize', nameSection: 'cardphoto' })
      )
    }
  }

  const handleIconFullCardClick = async (
    action: 'addCart' | 'addDrafts' | 'remove'
  ) => {
    if (!state.buttonsFullCard.fullCard[action]) return

    const id = uuidv4().split('-')[0]
    dispatch(setFullCard(true))
    const cardData = await getResultCardphoto()

    switch (action) {
      case 'addCart':
        await db.saveCardToCart(cardData, id)
        await updateDuplicateButtons()
        dispatch(setFullCardPersonalId({ cart: id }))
        break
      case 'addDrafts':
        await db.saveCardToDrafts(cardData, id)
        await updateDuplicateButtons()
        dispatch(setFullCardPersonalId({ drafts: id }))
        break
      case 'remove':
        resetAroma()
        resetDate()
        resetEnvelope()
        resetCardtext()
        await db.deleteMiniImage()
        dispatch(
          addIndexDb({
            stockImages: { miniImage: false },
            userImages: { miniImage: false },
          })
        )
        dispatch(
          setActiveSections({
            cardphoto: false,
            cardtext: false,
            envelope: false,
            date: false,
            aroma: false,
          })
        )
        state.setShowIconsMinimize(false)
        state.setMinimize(false)
        break
    }
  }

  const updateDuplicateButtons = async () => {
    const result = await getDuplicateSummary(state.selectorCardEdit)
    const updates: Partial<typeof state.buttonsFullCard.fullCard> = {}

    if (state.buttonsFullCard.fullCard.addCart !== !result.cart) {
      updates.addCart = result.cart ? false : true
    }
    if (state.buttonsFullCard.fullCard.addDrafts !== !result.drafts) {
      updates.addDrafts = result.drafts ? false : true
    }

    // if (Object.keys(updates).length > 0) {
    //   state.setButtonsFullCard((prev: CardActionsState) => ({
    //     ...prev,
    //     fullCard: { ...prev.fullCard, ...updates },
    //   }))
    // }
  }

  return {
    handleClickMiniKebab,
    handleClickCardtext,
    handleClickIconArrows,
    handleIconFullCardClick,
    updateDuplicateButtons,
  }
}
