import React from 'react'
import { LuCalendarArrowUp } from 'react-icons/lu'
import './ToolbarDate.scss'

const ToolbarDate = ({ choice }) => {
  return (
    <div className="toolbar-date">
      <span className="toolbar-btn-date">
        <LuCalendarArrowUp className="toolbar-icon-date" />
      </span>
      {choice
        ? 'The dispatch date has been selected'
        : 'Select the date of sending the postcard'}
    </div>
  )
}

export default ToolbarDate
