import { setActiveSection } from '@/entities/sectionEditorMenu/infrastructure/state'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { CardStatus } from '@entities/card/domain/types'
import {
  selectCardEditorState,
  selectPieProgress,
} from '@entities/cardEditor/infrastructure/selectors'
import {
  selectActiveCardFullData,
  selectCardFromArchive,
} from '../../infrastructure/selectors'
import { CardSection } from '@/shared/config/constants'
import { clearRainbow } from '@/entities/cardEditor/infrastructure/state'

export const useCardPieFacade = (status: CardStatus, id?: string) => {
  const dispatch = useAppDispatch()

  // const activeData = useAppSelector(selectCardEditorState)
  const activeData = useAppSelector(selectActiveCardFullData)
  const archiveData = useAppSelector((state) =>
    selectCardFromArchive(state, id, status),
  )

  const { sections, isRainbowActive, isRainbowStopping, isAllComplete } =
    useAppSelector(selectPieProgress)

  const currentData = status === 'processed' ? activeData : archiveData
  const isEditable = ['processed', 'drafts', 'error'].includes(status)

  return {
    sections,
    data: currentData,
    isRainbowActive,
    isRainbowStopping,
    isReady: isAllComplete,
    isEditable,

    onIteration: () => {
      if (isRainbowStopping) {
        dispatch(clearRainbow())
      }
    },
    handleSectorClick: (section: CardSection) => {
      if (isEditable) dispatch(setActiveSection(section))
    },
  }
}

// export const useCardPieFacade1 = (status: CardStatus, id?: string) => {
//   const dispatch = useAppDispatch()

//   const activeData = useAppSelector(selectActiveCardFullData)

//   const archiveData = useAppSelector((state) =>
//     selectCardFromArchive(state, id, status),
//   )

//   const currentData = status === 'processed' ? activeData : archiveData

//   const isEditable = ['processed', 'drafts', 'error'].includes(status)

//   return {
//     data: currentData,
//     isEditable,
//     isReady: currentData?.isCompleted ?? false,
//     handleSectorClick: (section: CardSection) => {
//       if (status === 'processed') dispatch(setActiveSection(section))
//     },
//   }
// }
