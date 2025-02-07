import { FiEdit, FiDownload, FiSave, FiDelete, FiCrop } from 'react-icons/fi'
import { PiArrowClockwiseFill } from 'react-icons/pi'
import { RiResetLeftFill } from 'react-icons/ri'

export const addIconToolbarCardphoto = (name) => {
  switch (name) {
    case 'download':
      return <FiDownload className="cardformnav-toolbar-icon" />
    case 'save':
      return <FiSave className="cardformnav-toolbar-icon" />
    case 'delete':
      return <FiDelete className="cardformnav-toolbar-icon" />
    case 'turn':
      return <PiArrowClockwiseFill className="cardformnav-toolbar-icon" />
    case 'edit':
      return <FiEdit className="cardformnav-toolbar-icon" />
    case 'crop':
      return <FiCrop className="cardformnav-toolbar-icon" />
    case 'reset':
      return <RiResetLeftFill className="cardformnav-toolbar-icon" />

    default:
      break
  }
}
