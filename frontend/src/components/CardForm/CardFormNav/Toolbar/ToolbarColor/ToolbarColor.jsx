// import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import './ToolbarColor.scss'
import listColor from '../../../../../data/cardtext/list-toolbar-color.json'
// import listColor from '../../../../../../data/cardtext/list-toolbar-color.json'
import { addCardtext } from '../../../../../store/slices/cardEditSlice'
// import { addCardtext } from '../../../../../../redux/cardEdit/actionCreators'

const ToolbarColor = ({ handleClickBtnToolbar }) => {
  const handleClick = (evt) => {
    handleClickColor(evt)
    handleClickBtnToolbar(evt)
  }

  const dispatch = useDispatch()

  const handleClickColor = (evt) => {
    dispatch(
      addCardtext({
        colorName: evt.target.dataset.colorName,
        colorType: evt.target.dataset.colorType,
      })
    )
  }

  return (
    <div className="toolbar-color">
      {listColor.map((el, i) => {
        return (
          <button
            className="toolbar-btn"
            key={`toolbar-color-${i}`}
            data-section="cardtext"
            data-tooltip={`color`}
            data-additional={`${el.name}-${el.code}`}
          >
            <span
              key={`${el.name}-${i}`}
              className="toolbar-more-btn"
              style={{ backgroundColor: el.code }}
              data-color-name={el.name}
              data-color-type={el.code}
              onClick={handleClick}
            ></span>
          </button>
        )
      })}
    </div>
  )
}

export default ToolbarColor
