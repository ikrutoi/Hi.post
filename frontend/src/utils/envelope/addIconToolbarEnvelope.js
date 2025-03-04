import { FiSave, FiDelete } from 'react-icons/fi'
import { FiPaperclip } from 'react-icons/fi'
import { LuPaperclip } from 'react-icons/lu'

export const addIconToolbarEnvelope = (section, icon, setIconRef) => {
  switch (icon) {
    case 'save':
      return (
        <FiSave
          ref={setIconRef(`${section}-${icon}`)}
          className="toolbar-icon"
        />
      )
    case 'clip':
      return (
        <LuPaperclip
          ref={setIconRef(`${section}-${icon}`)}
          className="toolbar-icon"
        />
      )
    case 'delete':
      return (
        <FiDelete
          ref={setIconRef(`${section}-${icon}`)}
          className="toolbar-icon"
        />
      )

    default:
      break
  }
}
