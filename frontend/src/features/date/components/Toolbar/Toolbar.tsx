import React from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@app/store/store'
import './Toolbar.scss'

export const Toolbar: React.FC = () => {
  const layoutActiveDate = useSelector(
    (state: RootState) => state.layout.activeSections.date
  )

  return (
    <div className="toolbar-date">
      <p className="toolbar-date-text" style={{ color: 'rgb(71, 71, 71)' }}>
        {layoutActiveDate
          ? 'Thank you, the postcard sending date has been selected'
          : 'Select the date of sending the postcard'}
      </p>
    </div>
  )
}
