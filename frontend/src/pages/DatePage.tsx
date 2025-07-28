import React from 'react'
import MiniCardPreview from '../../components/Common/MiniCardPreview'
import DateToolbar from '../../components/Date/DateToolbar'
import DateInteractiveCard from '../../components/Date/DateInteractiveCard'

const DatePage = () => {
  return (
    <div className="page date-page">
      <MiniCardPreview />
      <DateToolbar />
      <DateInteractiveCard />
    </div>
  )
}

export default DatePage
