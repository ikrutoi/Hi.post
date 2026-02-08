import { useSizeFacade } from './useSizeFacade'
import { useMemoryFacade } from './useMemoryFacade'
import { useMetaFacade } from './useMetaFacade'
import { useUiFacade } from './useUiFacade'
import { useSectionFacade } from './useSectionFacade'

export const useLayoutFacade = () => {
  const { size, actions: sizeActions } = useSizeFacade()
  const { memory, actions: memoryActions } = useMemoryFacade()
  const { meta, actions: metaActions } = useMetaFacade()
  const { ui, actions: uiActions } = useUiFacade()
  const { section, actions: sectionActions } = useSectionFacade()

  // console.log('USE_LAYOUT_FACADE')
  return {
    size,
    memory,
    meta,
    ui,
    section,
    actions: {
      ...sizeActions,
      ...memoryActions,
      ...metaActions,
      ...uiActions,
      ...sectionActions,
    },
  }
}
