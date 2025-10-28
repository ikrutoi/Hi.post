import { useLayoutFacade } from '@layout/application/facades'
import { AddressRole } from '@entities/envelope/domain/types'

export const useLayoutSelectedTemplateSection = () => {
  const {
    ui: { selectedTemplateSection },
    actions: { setUiSelectedTemplateSection },
  } = useLayoutFacade()

  const handleSelectedTemplateSection = (section: AddressRole) => {
    if (selectedTemplateSection === section) {
      setUiSelectedTemplateSection(null)
    } else {
      setUiSelectedTemplateSection(section)
    }
  }

  return { handleSelectedTemplateSection }
}
