import { useEffect } from 'react'
import { useAppSelector } from '@app/hooks'
import { useUiController } from '../controllers'

export const useSavedSelectedTemplateSection = () => {
  const selectTemplateSection = useAppSelector(
    (state) => state.layout.ui.selectedTemplateSection
  )
  const section = selectTemplateSection ?? null
  const { actions } = useUiController()
  const { resetUiTemplateSection } = actions

  useEffect(() => {
    if (!section) return

    // dispatch(fetchSavedData(section))

    // dispatch(openModal({ type: 'savedData', section }))

    resetUiTemplateSection()
  }, [section])
}
