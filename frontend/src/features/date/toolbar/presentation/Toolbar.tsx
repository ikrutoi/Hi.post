import React from 'react'
import './Toolbar.scss'

interface ToolbarProps {
  isDateActive: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({ isDateActive }) => (
  <div className="date-toolbar">
    <p className="date-toolbar__text">
      {isDateActive
        ? 'Thank you, the postcard sending date has been selected'
        : 'Select the date of sending the postcard'}
    </p>
  </div>
)
