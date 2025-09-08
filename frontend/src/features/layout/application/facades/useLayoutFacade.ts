import { useLayoutSizeFacade } from './useLayoutSizeFacade'
import { useLayoutSectionFacade } from './useLayoutSectionFacade'
import { useLayoutMemoryFacade } from './useLayoutMemoryFacade'
import { useLayoutMetaFacade } from './useLayoutMetaFacade'
import { useLayoutToolbarFacade } from './useLayoutToolbarFacade'
import { useLayoutActiveFacade } from './useLayoutActiveFacade'
import { useLayoutUiFacade } from './useLayoutUiFacade'
import { useLayoutStatusFacade } from './useLayoutStatusFacade'
import { useLayoutFullCardButtonsFacade } from './useLayoutFullCardButtonsFacade'

export const useLayoutFacade = () => ({
  size: useLayoutSizeFacade(),
  section: useLayoutSectionFacade(),
  memory: useLayoutMemoryFacade(),
  meta: useLayoutMetaFacade(),
  toolbar: useLayoutToolbarFacade(),
  active: useLayoutActiveFacade(),
  ui: useLayoutUiFacade(),
  status: useLayoutStatusFacade(),
  buttons: useLayoutFullCardButtonsFacade(),
})
