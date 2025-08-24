import React from 'react'
import './Cardtext.scss'
import { CardEditor } from '../CardEditor'
import { CardtextProps } from '@/features/cardtext/model/types'

export const Cardtext: React.FC<CardtextProps> = ({
  toolbarColor,
  styleLeftCardPuzzle,
}) => {
  return (
    <div className="cardtext">
      <CardEditor
        toolbarColor={toolbarColor}
        styleLeftCardPuzzle={styleLeftCardPuzzle}
      />
    </div>
  )
}
