import { useLayoutFacade } from '@layout/application/facades'
import type { EnvelopeRole } from '@shared/config/constants'

export const useLayoutSelectedTemplateSection = () => {
  const {
    ui: { selectedTemplateSection },
    actions: { setUiSelectedTemplateSection },
  } = useLayoutFacade()

  const handleSelectedTemplateSection = (section: EnvelopeRole) => {
    if (selectedTemplateSection === section) {
      setUiSelectedTemplateSection(null)
    } else {
      setUiSelectedTemplateSection(section)
    }
  }

  return { handleSelectedTemplateSection }
}
