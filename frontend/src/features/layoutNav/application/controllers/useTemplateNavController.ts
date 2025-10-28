import { useAppDispatch } from '@app/hooks'
import { templateNavActions } from '../../infrastructure/state'
import type { Template } from '@shared/config/constants'

const { setSelectedTemplate, clearSelectedTemplate } = templateNavActions

export const useTemplateNavController = () => {
  const dispatch = useAppDispatch()

  const selectTemplate = (template: Template) => {
    dispatch(setSelectedTemplate(template))
  }

  const clearTemplate = () => {
    dispatch(clearSelectedTemplate())
  }

  return {
    state: {
      selectTemplate,
    },
    actions: {
      clearTemplate,
    },
  }
}
