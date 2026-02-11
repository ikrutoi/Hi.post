import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectPreviewCard,
  selectIsProcessedReady,
  selectActiveSection,
} from '../../infrastructure/selectors'
import { cardActions } from '../../infrastructure/state'
import type { CardSection } from '@shared/config/constants'

export const useCardFacade = () => {
  const dispatch = useAppDispatch()

  const previewCard = useAppSelector(selectPreviewCard)
  const isReady = useAppSelector(selectIsProcessedReady)
  const isPreviewOpen = !!previewCard
  const activeSection = useAppSelector(selectActiveSection)

  const openSection = (section: CardSection | null) => {
    dispatch(cardActions.openSection(section))
  }
  const openPreview = (id: string) => dispatch(cardActions.setPreviewCardId(id))
  const closePreview = () => dispatch(cardActions.setPreviewCardId(null))

  const copyFull = (donorId: string) => {
    dispatch(cardActions.requestFullCopy(donorId))
  }

  const copySection = (donorId: string, section: CardSection) => {
    dispatch(cardActions.copySectionToProcessed({ donorId, section }))
  }

  return {
    previewCard,
    isReady,
    isPreviewOpen,
    activeSection,
    openSection,
    openPreview,
    closePreview,
    copyFull,
    copySection,
  }
}
