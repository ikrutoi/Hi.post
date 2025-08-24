import React from 'react'

import './Cardphoto.scss'

import ImageCrop from './ImageCrop/ImageCrop'
import { Toolbar } from './Toolbar/Toolbar'

import { CardphotoProps } from '../types'

const Cardphoto = ({ sizeCard, choiceSection, choiceClip }: CardphotoProps) => {
  return (
    <div className="cardphoto">
      {choiceClip.clipId !== 'shopping' &&
        choiceClip.clipId !== 'minimize' &&
        choiceClip.clipId !== 'blanks' && (
          <div className="nav-container nav-container-cardphoto">
            <Toolbar />
          </div>
        )}
      <ImageCrop sizeCard={sizeCard} />
    </div>
  )
}

export default Cardphoto
