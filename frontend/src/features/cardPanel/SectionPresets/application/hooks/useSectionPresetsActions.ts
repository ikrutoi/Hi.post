import { presetService } from '../services/presetService'
import { addressService } from '../services/addressService'
import { useLayoutFacade } from '@layout/application/facades'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import { useEnvelopeFacade } from '@envelope/application/facades'
import type { CartItem } from '@entities/cart/domain/types'
import type { Template } from '@shared/config/constants'

type PresetAction = 'save' | 'remove'

export const useSectionPresetsActions = (
  template: Template,
  cart: CartItem[],
  getMemoryCards: (source: Template) => Promise<void>
) => {
  // const { setUiState } = useEnvelopeFacade()
  const {
    actions: {
      setExpendMemoryCard,
      setLockExpendMemoryCard,
      // setChoiceClip,
      setFullCard,
    },
  } = useLayoutFacade()

  const { actions } = useLayoutNavFacade()
  const { selectTemplate } = actions

  const handleClickCard = (id: string) => {
    setLockExpendMemoryCard(false)
    // setExpendMemoryCard({
    //   id,
    //   section: template,
    //   timestamp: Date.now(),
    // })

    // if (template === 'cart' || template === 'drafts') {
    //   setChoiceClip(false)
    // }
  }

  const handleBtnCardClick = async (btn: PresetAction, id: string) => {
    const card = cart.find((card) => card.id === id)
    if (!card) return

    if (btn === 'save' && card.id) {
      switch (template) {
        case 'cart':
        case 'drafts':
          await presetService.saveBlank(card)
          break
        case 'recipient':
          await addressService.saveRecipient(card.recipient!, card.id)
          break
        // case 'sender':
        //   await addressService.saveSender(card.sender!, card.id)
        //   break
      }
    }

    if (btn === 'remove') {
      await presetService.deletePreset(template, id)

      // if (template === 'recipient' || template === 'sender') {
      //   setUiState({ envelopeRemoveAddress: template })
      // }
    }

    await getMemoryCards(template)
    setFullCard(true)
  }

  return { handleClickCard, handleBtnCardClick }
}
