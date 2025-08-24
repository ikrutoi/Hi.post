import React from 'react'
import './Cardtext.scss'
import CardEditor from './CardEditor/CardEditor'

const Cardtext = ({ toolbarColor, styleLeftCardPuzzle }) => {
  return (
    <div className="cardtext">
      <CardEditor
        toolbarColor={toolbarColor}
        styleLeftCardPuzzle={styleLeftCardPuzzle}
      />
    </div>
  )
}

export default Cardtext
