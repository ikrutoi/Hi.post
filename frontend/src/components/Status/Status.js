import { MdOutlineShoppingCart } from 'react-icons/md'
import './Status.scss'

const Status = () => {
  return (
    <div className="status-container">
      <button className="toolbar-btn">
        <MdOutlineShoppingCart className="toolbar-status-icon" />
      </button>
    </div>
  )
}

export default Status
