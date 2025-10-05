import { PresetSource, SectionPreset } from '../../domain/types'
import { presetService } from '../services/presetService'
import { addressService } from '../services/addressService'
import { useLayoutControllers } from '@/features/layout/application/hooks'
import { useAppDispatch } from '@app/hooks'
import { updateButtonsState } from '../state/infoButtonsSlice'

type PresetAction = 'save' | 'remove'

export const useSectionPresetsActions = (
  sectionClip: PresetSource,
  memoryList: SectionPreset[],
  getMemoryCards: (source: PresetSource) => Promise<void>
) => {
  const dispatch = useAppDispatch()
  const {
    setLockExpendMemoryCard,
    setExpendMemoryCard,
    setChoiceClip,
    setFullCard,
  } = useLayoutControllers()

  const handleClickCard = (id: string) => {
    setLockExpendMemoryCard(false)
    setExpendMemoryCard({ source: sectionClip, id })

    if (sectionClip === 'cart' || sectionClip === 'drafts') {
      setChoiceClip(false)
    }
  }

  const handleBtnCardClick = async (btn: PresetAction, id: string) => {
    const card = memoryList.find((c) => c.id === id)
    if (!card) return

    if (btn === 'save' && card.personalId) {
      switch (sectionClip) {
        case 'cart':
        case 'drafts':
          await presetService.saveBlank(card)
          break
        case 'recipient':
          await addressService.saveRecipient(card.address!, card.personalId)
          break
        case 'sender':
          await addressService.saveSender(card.address!, card.personalId)
          break
      }
    }

    if (btn === 'remove') {
      await presetService.deletePreset(sectionClip, id)

      if (sectionClip === 'recipient' || sectionClip === 'sender') {
        dispatch(updateButtonsState({ envelopeRemoveAddress: sectionClip }))
      }
    }

    await getMemoryCards(sectionClip)
    setFullCard(true)
  }

  return { handleClickCard, handleBtnCardClick }
}
