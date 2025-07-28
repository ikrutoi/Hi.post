import React from 'react'
import MiniCardPreview from '../../components/Common/MiniCardPreview'
import EnvelopeToolbar from '../../components/Envelope/EnvelopeToolbar'
import EnvelopeInteractiveCard from '../../components/Envelope/EnvelopeInteractiveCard'

const EnvelopePage = () => {
  return (
    <div className="page envelope-page">
      <MiniCardPreview />
      <EnvelopeToolbar />
      <EnvelopeInteractiveCard />
    </div>
  )
}

export default EnvelopePage
