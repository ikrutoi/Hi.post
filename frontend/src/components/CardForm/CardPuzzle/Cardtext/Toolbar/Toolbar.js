import { useState } from 'react'
import { useSelector } from 'react-redux'
import './Toolbar.scss'
import listNavBtns from '../../../../../data/cardtext/list-textarea-nav-btns.json'

const Toolbar = () => {
  const selector = useSelector((state) => state.cardEdit.cardtext)
  const inputCardtext = selector.text
    ? selector
    : {
        text: { row1: 'hello...' },
        maxchars: 300,
        color: 'blue1',
        fontsize: 3,
        lines: 1,
        focus: false,
        focusrow: 1,
      }
  const [cardtext, setCardtext] = useState(inputCardtext)
  return (
    <div className="toolbar">
      <div className="toolbar-settings">
        {listNavBtns.map((btn, i) => (
          <span
            className={`toolbar-btn toolbar-btn-set toolbar-${btn}`}
            key={i}
          ></span>
        ))}
      </div>
      <div className="toolbar-chars">
        <span className="toolbar-btn toolbar-btn-chars toolbar-enteredchars">
          {cardtext.text.length}
        </span>
        <span className="toolbar-btn">/</span>
        <span className="toolbar-btn toolbar-btn-chars toolbar-maxchars">
          {cardtext.maxchars}
        </span>
      </div>
    </div>
  )
}

export default Toolbar
