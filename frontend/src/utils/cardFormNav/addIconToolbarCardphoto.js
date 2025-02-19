import { FiEdit, FiDownload, FiSave, FiDelete, FiCrop } from 'react-icons/fi'
import { PiArrowClockwiseFill } from 'react-icons/pi'
import { RiResetLeftFill } from 'react-icons/ri'
import { TbArrowsMaximize } from 'react-icons/tb'

export const addIconToolbarCardphoto = (name) => {
  switch (name) {
    case 'download':
      return <FiDownload className="toolbar-icon" />
    case 'save':
      return <FiSave className="toolbar-icon" />
    case 'delete':
      return <FiDelete className="toolbar-icon" />
    case 'turn':
      return <PiArrowClockwiseFill className="toolbar-icon" />
    case 'edit':
      return <FiEdit className="toolbar-icon" />
    case 'maximaze':
      return <TbArrowsMaximize className="toolbar-icon" />
    case 'crop':
      return <FiCrop className="toolbar-icon" />
    case 'reset':
      return <RiResetLeftFill className="toolbar-icon" />

    default:
      break
  }
}
