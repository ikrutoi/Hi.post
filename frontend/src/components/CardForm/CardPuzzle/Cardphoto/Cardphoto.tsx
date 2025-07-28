import React from 'react'
import './Cardphoto.scss'
import ImageCrop from './ImageCrop/ImageCrop'
import ToolbarCardphoto from './ToolbarCardphoto/ToolbarCardphoto'
import { CardphotoProps } from '../../../../types/card'

const Cardphoto = ({ sizeCard, choiceSection, choiceClip }: CardphotoProps) => {
  return (
    <div className="cardphoto">
      {choiceClip.clipId !== 'shopping' &&
        choiceClip.clipId !== 'minimize' &&
        choiceClip.clipId !== 'blanks' && (
          <div className="nav-container nav-container-cardphoto">
            <ToolbarCardphoto />
          </div>
        )}
      <ImageCrop sizeCard={sizeCard} />
    </div>
  )
}

export default Cardphoto
