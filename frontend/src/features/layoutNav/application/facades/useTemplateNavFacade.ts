import { useAppSelector } from '@app/hooks'
import { getSelectedTemplate } from '../../infrastructure/selectors'
import { useTemplateNavController } from '../controllers'

export const useTemplateNavFacade = () => {
  const selectedTemplate = useAppSelector(getSelectedTemplate)
  const { state, actions } = useTemplateNavController()

  return {
    state: {
      selectedTemplate,
    },
    actions: {
      ...state,
      ...actions,
    },
  }
}
