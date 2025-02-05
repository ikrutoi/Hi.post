// import { useRef } from 'react'
import './ToolbarColor.scss'
import listColor from '../../../../../../data/cardtext/list-toolbar-color.json'
import { useDispatch } from 'react-redux'
import { addCardtext } from '../../../../../../redux/cardEdit/actionCreators'

const ToolbarColor = ({ color }) => {
  const handleClick = (evt) => {
    handleClickColor(evt)
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
  // console.log('**', tooltip)
  // useEffect(() => {
  //   // if (btnTooltipRef.current) {
  //     const widthBtn = btnTooltipRef.current.offsetWidth
  //     const calcLeft = tooltip.left - widthBtn / 2 + tooltip.widthbtn / 2
  //     setLeftBtnTooltip(calcLeft)
  //     setIsVisibility('visible')
  //   // }
  // }, [tooltip])
  return (
    <div className="toolbar-color">
      {listColor.map((el, i) => {
        return (
          <span
            key={`${el.name}-${i}`}
            className="toolbar-more-btn"
            style={{ backgroundColor: el.code }}
            data-color-name={el.name}
            data-color-type={el.code}
            onClick={handleClick}
          ></span>
        )
      })}
    </div>
  )
}

export default ToolbarColor
