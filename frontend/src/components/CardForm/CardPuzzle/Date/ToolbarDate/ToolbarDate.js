import { useSelector } from 'react-redux'
import { LuCalendarArrowUp } from 'react-icons/lu'
import './ToolbarDate.scss'

const ToolbarDate = () => {
  const sectionDate = useSelector((state) => state.cardEdit.date)
  return (
    <div className="toolbar-date">
      <span className="toolbar-btn-date">
        <LuCalendarArrowUp className="toolbar-icon toolbar-icon-date" />
      </span>
      <p className="toolbar-date-text">
        {sectionDate
          ? 'The dispatch date has been selected'
          : 'Select the date of sending the postcard'}
      </p>
    </div>
  )
}

export default ToolbarDate
