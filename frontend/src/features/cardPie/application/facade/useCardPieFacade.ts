import { setActiveSection } from '@/entities/sectionEditorMenu/infrastructure/state'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { CardStatus } from '@entities/card/domain/types'
import { selectCardEditorState } from '@entities/cardEditor/infrastructure/selectors'
import {
  selectActiveCardFullData,
  selectCardFromArchive,
} from '../../infrastructure/selectors'
import { CardSection } from '@/shared/config/constants'

export const useCardPieFacade = (status: CardStatus, id?: string) => {
  const dispatch = useAppDispatch()

  const activeData = useAppSelector(selectActiveCardFullData)

  const archiveData = useAppSelector((state) =>
    selectCardFromArchive(state, id, status),
  )

  const currentData = status === 'processed' ? activeData : archiveData

  const isEditable = ['processed', 'drafts', 'error'].includes(status)

  return {
    data: currentData,
    isEditable,
    isReady: currentData?.isCompleted ?? false,
    handleSectorClick: (section: CardSection) => {
      if (status === 'processed') dispatch(setActiveSection(section))
    },
  }
}
