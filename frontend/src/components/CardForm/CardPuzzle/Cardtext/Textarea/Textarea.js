import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { addCardtext } from '../../../../../redux/cardEdit/actionCreators'
import './Textarea.scss'
import listNavBtns from '../../../../../data/cardtext/list-textarea-nav-btns.json'
// import Line from './Line/Line'
import DraftEditor from '../DraftEditor/DraftEditor'

const Textarea = () => {
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

  const lineRef = useRef({})
  const setRef = (id) => (element) => {
    lineRef.current[id] = element
  }
  // const handleClickTextarea = () => {
  //   const range = document.createRange()
  //   const sel = window.getSelection()
  //   range.setStart(
  //     rowRef.current[`line-${cardtext.focusrow}`].firstChild,
  //     rowRef.current[`line-${cardtext.rows}`].innerText.length
  //   )
  //   range.collapse(true)
  //   sel.removeAllRanges()
  //   sel.addRange(range)
  //   rowRef.current[`-${cardtext.focusrow}`].focus()
  // }

  const handleInput = (e) => {
    setCardtext((state) => {
      return {
        ...state,
        text: {
          ...state.text,
          [`line${e.target.dataset.rows}`]: e.target.innerText,
        },
        focusrow: e.target.dataset.row,
      }
    })
  }

  // useEffect(() => {
  //   if (rowRef.current) {
  //     rowRef.current[`row-${cardtext.rows}`].innerText =
  //       cardtext.text[`row${cardtext.rows}`]
  //   }
  // }, [])

  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(addCardtext(cardtext))
  // }, [dispatch, cardtext])

  return (
    <div className="textarea">
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
        <DraftEditor />
        {/* <Line handleInput={handleInput} setRef={setRef} cardtext={cardtext} /> */}
      </div>
    </div>
  )
}

export default Textarea
