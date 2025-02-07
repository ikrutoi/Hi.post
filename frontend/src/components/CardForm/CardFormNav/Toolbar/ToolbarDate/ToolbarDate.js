import { LuCalendarArrowUp } from 'react-icons/lu'
import './ToolbarDate.scss'

const ToolbarDate = () => {
  return (
    <div className="toolbar-date">
      <span className="toolbar-btn-date">
        <LuCalendarArrowUp className="toolbar-icon-date" />
      </span>
      Select the date of sending the postcard
    </div>
  )
}

export default ToolbarDate
