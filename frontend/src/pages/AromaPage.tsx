import React from 'react'
import MiniCardPreview from '../../components/Common/MiniCardPreview'
import AromaToolbar from '../../components/Aroma/AromaToolbar'
import AromaInteractiveCard from '../../components/Aroma/AromaInteractiveCard'

const AromaPage = () => {
  return (
    <div className="page aroma-page">
      <MiniCardPreview />
      <AromaToolbar />
      <AromaInteractiveCard />
    </div>
  )
}

export default AromaPage
