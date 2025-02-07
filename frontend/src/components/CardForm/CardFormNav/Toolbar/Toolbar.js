import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import './Toolbar.scss'
import listNavBtnsCardtext from '../../../../data/cardtext/list-textarea-nav-btns.json'
import listNavBtnsCardphoto from '../../../../data/cardphoto/list-toolbar-cardphoto.json'
import ToolbarColor from './ToolbarColor/ToolbarColor'
import { addCardtext } from '../../../../redux/cardEdit/actionCreators'
import { addIconToolbarCardtext } from '../../../../utils/cardFormNav/addIconToolbar.js'
import { addIconToolbarCardphoto } from '../../../../utils/cardFormNav/addIconToolbarCardphoto.js'

const Toolbar = ({
  nameSection,
  handleClickBtnNav,
  setToolbarColorActive,
  // handleClickToolbar,
  // handleClickColor,
  toolbarColor,
}) => {
  // const [tooltip, setTooltip] = useState(null)
  const dispatch = useDispatch()
  const [listBtns, setListBtns] = useState(null)

  useEffect(() => {
    switch (nameSection) {
      case 'cardtext':
        setListBtns(listNavBtnsCardtext)
        break
      case 'cardphoto':
        setListBtns(listNavBtnsCardphoto)
        break

      default:
        break
    }
  }, [nameSection])

  const handleClickToolbar = (evt, i) => {
    const searchParentBtnNav = (el) => {
      if (el.classList.contains('toolbar-btn')) {
        return el
      } else if (el.parentElement) {
        return searchParentBtnNav(el.parentElement)
      }
      return null
    }

    const parentBtnNav = searchParentBtnNav(evt.target)

    handleClickBtnNav(parentBtnNav)
    const btnTooltip = parentBtnNav.dataset.tooltip

    if (btnTooltip === 'color') {
      setToolbarColorActive(true)
    }
    if (
      btnTooltip === 'left' ||
      btnTooltip === 'center' ||
      btnTooltip === 'right' ||
      btnTooltip === 'justify'
    ) {
      dispatch(addCardtext({ textAlign: parentBtnNav.dataset.tooltip }))
    }
    // }
  }

  // const handleMouseEnter = (evt) => {
  //   const toolbarElement = document.querySelector('.toolbar')
  //   const toolbarBtnElement = document.querySelectorAll('.toolbar-btn')[0]
  //   const widthToolbarBtn = toolbarBtnElement.getBoundingClientRect().width
  //   const leftToolbar = toolbarElement.getBoundingClientRect().left
  //   const target = evt.target
  //   const coords = target.getBoundingClientRect()
  //   const left = coords.left - leftToolbar
  //   const tooltipBtn = target.dataset.tooltip
  //   if (!tooltipBtn) {
  //     return
  //   }
  //   setTooltip({
  //     text: tooltipBtn,
  //     targetElement: target,
  //     left: `${left}`,
  //     widthbtn: widthToolbarBtn,
  //   })
  // }

  // const handleMouseLeave = () => {
  //   setTooltip(null)
  // }

  // const iconItalicRef = useRef(null)
  // const handleChoiceActive = (icon) => {
  //   if (icon === cardtext.textAlign || icon === cardtext.fontStyle) {
  //     return 'rgb(71, 71, 71)'
  //   }
  // }

  // useEffect(() => {
  //   btnRefs.current = listNavBtns.map(
  //     (_, i) => btnRefs.current[i] ?? createRef()
  //   )
  // }, [btnRefs])

  const addIconToolbar = (nameSection, nameBtn) => {
    switch (nameSection) {
      case 'cardphoto':
        return addIconToolbarCardphoto(nameBtn)
      case 'cardtext':
        return addIconToolbarCardtext(nameBtn)

      default:
        break
    }
  }

  return (
    <div className={`toolbar toolbar-${nameSection}`}>
      <div className={`toolbar-settings toolbar-settings-${nameSection}`}>
        {listBtns &&
          listBtns.map((btn, i) => (
            <span
              className={`toolbar-btn toolbar-btn-${nameSection} toolbar--${btn}`}
              data-tooltip={btn}
              key={i}
              // ref={btnRefs.current[i]}
              onClick={(event) => handleClickToolbar(event, i)}
              // onMouseEnter={handleMouseEnter}
              // onMouseLeave={handleMouseLeave}
            >
              {/* {btn} */}
              {addIconToolbar(nameSection, btn)}
            </span>
          ))}
        {/* {tooltip && <Tooltip tooltip={tooltip} />} */}
      </div>
      <div className="toolbar-cardtext-more">
        {toolbarColor && (
          <ToolbarColor
            color={toolbarColor.color}
            // handleClickColor={handleClickColor}
          />
        )}
      </div>
    </div>
  )
}

export default Toolbar
