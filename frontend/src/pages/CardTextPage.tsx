import React from 'react'
import MiniCardPreview from '../../components/Common/MiniCardPreview'
import CardTextToolbar from '../../components/CardText/CardTextToolbar'
import CardTextInteractive from '../../components/CardText/CardTextInteractive'

const CardtextPage = () => {
  return (
    <div className="page cardtext-page">
      <MiniCardPreview />
      <CardTextToolbar />
      <CardTextInteractive />
    </div>
  )
}

export default CardtextPage
