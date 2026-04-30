import { presetService } from '../services/presetService'
import { addressService } from '../services/addressService'
import { useLayoutFacade } from '@layout/application/facades'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import type { PostcardHydrated } from '@entities/postcard'
import type { DraftsItem } from '@entities/drafts/domain/types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { Template } from '@shared/config/constants'
import { sectionPresetRowId, type SectionPresetRow } from '../helpers/sectionPresetRow'

type PresetAction = 'save' | 'remove'

export const useSectionPresetsActions = (
  template: Template,
  cart: SectionPresetRow[],
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
    const card = cart.find((row) => sectionPresetRowId(row) === id)
    if (!card) return

    if (btn === 'save') {
      switch (template) {
        case 'cart':
        case 'drafts':
          if ('card' in card) {
            await presetService.saveBlank(card as PostcardHydrated | DraftsItem)
          }
          break
        case 'recipient': {
          const rid = sectionPresetRowId(card)
          if ('card' in card) {
            const addr =
              card.card.envelope.recipient.appliedData ??
              card.card.envelope.recipient.viewDraft
            if (addr) await addressService.saveRecipient(addr, rid)
          } else {
            const addr = (card as AddressTemplateItem).address
            if (addr) await addressService.saveRecipient(addr, rid)
          }
          break
        }
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
