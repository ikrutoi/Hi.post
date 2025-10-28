import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { getResultCardphoto } from '@cardPanel/utils/getResultCardphoto'
import { getDuplicateSummary } from '@cardPanel/domain/logic'
import { emptyAddress } from '@/features/envelope/domain/constants/address.constants'
import {
  addAroma,
  addCardtext,
  addDate,
  addEnvelope,
} from '@store/slices/cardEditSlice'
import {
  setFullCard,
  setChoiceMemorySection,
  setActiveSections,
  addChoiceSection,
  setFullCardPersonalId,
  addIndexDb,
} from '@store/slices/layoutSlice'

import type {
  CardPanelHandlers,
  CardPanelState,
  CardPanelDb,
  CardActionsState,
} from '@/features/cardPanel/domain/types'

export const useCardPanelHandlers = (
  state: CardPanelState,
  db: CardPanelDb
): CardPanelHandlers => {
  const dispatch = useDispatch()

  const handleClickMiniKebab = async (section: string, id: string) => {
    switch (section) {
      case 'cardtext':
        await db.deleteCardtextById(id)
        break
      case 'aroma':
        dispatch(addAroma(null))
        break
    }
  }

  const handleClickCardtext = (id: string) => {
    dispatch(setChoiceMemorySection({ section: 'cardtext', id }))
  }

  const handleClickIconArrows = async () => {
    state.setMinimize((prev) => !prev)
    await updateDuplicateButtons()
    if (state.selectorLayoutChoiceSection.source !== 'minimize') {
      dispatch(
        addChoiceSection({ source: 'minimize', nameSection: 'cardphoto' })
      )
    }
  }

  const handleIconFullCardClick = async (
    action: 'addCart' | 'save' | 'remove'
  ) => {
    if (!state.btnsFullCard.fullCard[action]) return

    const personalId = uuidv4().split('-')[0]
    dispatch(setFullCard(true))
    const cardData = await getResultCardphoto()

    switch (action) {
      case 'addCart':
        await db.saveCardToCart(cardData, personalId)
        await updateDuplicateButtons()
        dispatch(setFullCardPersonalId({ cart: personalId }))
        break
      case 'save':
        await db.saveCardToDrafts(cardData, personalId)
        await updateDuplicateButtons()
        dispatch(setFullCardPersonalId({ drafts: personalId }))
        break
      case 'remove':
        dispatch(addAroma(null))
        dispatch(addDate(null))
        dispatch(addEnvelope({ sender: emptyAddress, recipient: emptyAddress }))
        dispatch(
          addCardtext({
            text: [{ type: 'paragraph', children: [{ text: '' }] }],
            colorName: 'blueribbon',
            colorType: 'rgba(0, 122, 255, 0.8)',
            fontStyle: 'italic',
            fontWeight: 500,
          })
        )
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
    const updates: Partial<typeof state.btnsFullCard.fullCard> = {}

    if (state.btnsFullCard.fullCard.addCart !== !result.cart) {
      updates.addCart = result.cart ? false : true
    }
    if (state.btnsFullCard.fullCard.save !== !result.drafts) {
      updates.save = result.drafts ? false : true
    }

    if (Object.keys(updates).length > 0) {
      state.setBtnsFullCard((prev: CardActionsState) => ({
        ...prev,
        fullCard: { ...prev.fullCard, ...updates },
      }))
    }
  }

  return {
    handleClickMiniKebab,
    handleClickCardtext,
    handleClickIconArrows,
    handleIconFullCardClick,
    updateDuplicateButtons,
  }
}
