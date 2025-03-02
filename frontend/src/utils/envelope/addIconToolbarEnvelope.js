import { FiSave, FiDelete } from 'react-icons/fi'
import { FiPaperclip } from 'react-icons/fi'
import { LuPaperclip } from 'react-icons/lu'

export const addIconToolbarEnvelope = (name) => {
  switch (name) {
    case 'save':
      return <FiSave className="toolbar-icon" />
    case 'clip':
      return <LuPaperclip className="toolbar-icon" />
    case 'delete':
      return <FiDelete className="toolbar-icon" />

    default:
      break
  }
}
