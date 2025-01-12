import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCardtext } from '../../../../../redux/cardEdit/actionCreators'
import './Textarea.scss'
import listNavBtns from '../../../../../data/cardtext/list-textarea-nav-btns.json'
import Row from './Row/Row'

const Textarea = () => {
  const selector = useSelector((state) => state.cardEdit.cardtext)
  const inputCardtext = selector.text
    ? selector
    : {
        text: { row1: 'hello...' },
        maxchars: 300,
        color: 'blue1',
        fontsize: 3,
        rows: 1,
        focus: false,
        focusrow: 1,
      }
  const [cardtext, setCardtext] = useState(inputCardtext)

  const rowRef = useRef({})
  const setRef = (id) => (element) => {
    rowRef.current[id] = element
  }
  const handleClickTextarea = () => {
    const range = document.createRange()
    const sel = window.getSelection()
    range.setStart(
      rowRef.current[`row-${cardtext.focusrow}`].firstChild,
      rowRef.current[`row-${cardtext.rows}`].innerText.length
    )
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
    rowRef.current[`row-${cardtext.focusrow}`].focus()
  }

  const handleInput = (e) => {
    setCardtext((state) => {
      return {
        ...state,
        text: {
          ...state.text,
          [`row${e.target.dataset.rows}`]: e.target.innerText,
        },
        focusrow: e.target.dataset.row,
      }
    })
  }

  useEffect(() => {
    if (rowRef.current) {
      rowRef.current[`row-${cardtext.rows}`].innerText =
        cardtext.text[`row${cardtext.rows}`]
    }
  }, [])

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(addCardtext(cardtext))
  }, [dispatch, cardtext])

  return (
    <div className="textarea" onClick={handleClickTextarea}>
      <div className="textarea-nav">
        <div className="textarea-settings">
          {listNavBtns.map((btn, i) => (
            <span
              className={`textarea-nav-btn textarea-nav-btn-set textarea-nav-${btn}`}
              key={i}
            ></span>
          ))}
        </div>
        <div className="textarea-chars">
          <span className="textarea-nav-btn textarea-nav-btn-chars textarea-enteredchars">
            {cardtext.text.length}
          </span>
          <span className="textarea-nav-btn">/</span>
          <span className="textarea-nav-btn textarea-nav-btn-chars textarea-maxchars">
            {cardtext.maxchars}
          </span>
        </div>
      </div>
      <div className="cardtext-textarea">
        <Row handleInput={handleInput} setRef={setRef} cardtext={cardtext} />
      </div>
    </div>
  )
}

export default Textarea
