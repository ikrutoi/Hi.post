import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { openDB } from 'idb'
import './Toolbar.scss'
import listNavBtnsCardtext from '../../../../data/cardtext/list-textarea-nav-btns.json'
import listNavBtnsCardphoto from '../../../../data/cardphoto/list-toolbar-cardphoto.json'
import ToolbarColor from './ToolbarColor/ToolbarColor'
import { addCardtext } from '../../../../redux/cardEdit/actionCreators'
// import { addIconToolbarCardtext } from '../../../../utils/cardFormNav/addIconToolbarCardtext.js'
import { addIconToolbarCardphoto } from '../../../../utils/cardFormNav/addIconToolbarCardphoto.js'
// import { useIndexedDB } from '../../../../data/cardFormNav/useIndexedDB.js'
// import { addChoiceSection } from '../../../../redux/layout/actionCreators.js'
// import { ReactComponent as IconFull } from '../../../../data/img/icon--full-size.svg'

const Toolbar = ({ nameSection, handleClickBtnToolbar }) => {
  const layoutBtnToolbar = useSelector((state) => state.layout.btnToolbar)
  const infoButtons = useSelector((state) => state.infoButtons)
  const cardphoto = useSelector((state) => state.cardEdit.cardphoto)
  const workingImage = useSelector((state) => state.layout.workingImage)
  const [toolbarColor, setToolbarColor] = useState(null)
  const dispatch = useDispatch()
  const [listBtns, setListBtns] = useState(null)
  const btnRefs = useRef({})

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

  useEffect(() => {
    if (layoutBtnToolbar.firstBtn === 'color') {
      setToolbarColor(true)
    } else {
      if (toolbarColor) {
        setToolbarColor(false)
      }
    }
  }, [layoutBtnToolbar, toolbarColor])

  const searchParentBtnNav = (el) => {
    if (el.classList.contains('toolbar-btn')) {
      return el
    } else if (el.parentElement) {
      return searchParentBtnNav(el.parentElement)
    }
    return null
  }

  const handleClickToolbar = (evt, nameBtn) => {
    handleClickBtnToolbar(evt)

    const parentBtnNav = searchParentBtnNav(evt.target)

    if (parentBtnNav.dataset.tooltip === 'download') {
      if (parentBtnNav.style.color === 'rgb(71, 71, 71)') {
        parentBtnNav.style.color = 'rgb(163, 163, 163)'
      }
    }

    if (parentBtnNav.dataset.tooltip === 'save') {
      parentBtnNav.style.color = 'rgb(163, 163, 163)'
      parentBtnNav.style.cursor = 'default'
    }

    const btnTooltip = parentBtnNav.dataset.tooltip
    if (
      btnTooltip === 'left' ||
      btnTooltip === 'center' ||
      btnTooltip === 'right' ||
      btnTooltip === 'justify'
    ) {
      dispatch(addCardtext({ textAlign: parentBtnNav.dataset.tooltip }))
    }
  }

  const addIconToolbar = (nameSection, nameBtn) => {
    switch (nameSection) {
      case 'cardphoto':
        return addIconToolbarCardphoto(nameBtn)
      // case 'cardtext':
      //   return addIconToolbarCardtext(nameBtn)

      default:
        break
    }
  }

  const handleMouseEnter = (evt) => {
    const parentBtnNav = searchParentBtnNav(evt.target)

    if (
      parentBtnNav.dataset.tooltip === 'save' ||
      parentBtnNav.dataset.tooltip === 'maximaze'
    ) {
      if (!infoButtons.crop) {
        parentBtnNav.style.color = 'rgb(163, 163, 163)'
        parentBtnNav.style.cursor = 'default'
      } else {
        parentBtnNav.style.color = 'rgb(71, 71, 71)'
        parentBtnNav.style.cursor = 'pointer'
      }
    } else {
      if (
        workingImage === 'startImage' &&
        parentBtnNav.dataset.tooltip === 'delete'
      ) {
        parentBtnNav.style.color = 'rgb(163, 163, 163)'
        parentBtnNav.style.cursor = 'default'
      } else {
        parentBtnNav.style.color = 'rgb(71, 71, 71)'
        parentBtnNav.style.cursor = 'pointer'
      }
    }
  }

  const handleMouseLeave = (evt) => {
    const parentBtnNav = searchParentBtnNav(evt.target)
    if (parentBtnNav.dataset.tooltip === 'crop' && infoButtons.crop) {
      parentBtnNav.style.color = 'rgb(71, 71, 71)'
    } else {
      parentBtnNav.style.color = 'rgb(163, 163, 163)'
    }
  }

  const handleRef = (name) => (element) => {
    btnRefs.current[name] = element
  }

  useEffect(() => {
    if (btnRefs.current && btnRefs.current.crop) {
      if (infoButtons.crop) {
        btnRefs.current.crop.style.color = 'rgb(71, 71, 71)'
      } else {
        btnRefs.current.crop.style.color = 'rgb(163, 163, 163)'
      }
    }
  }, [infoButtons, btnRefs])

  useEffect(() => {
    if (btnRefs.current && btnRefs.current.delete) {
      if (workingImage === 'startImage') {
        btnRefs.current.delete.style.color = 'rgb(163, 163, 163)'
        btnRefs.current.delete.style.cursor = 'default'
      }
    }
  }, [cardphoto, btnRefs, workingImage])

  return (
    <div className={`toolbar toolbar-${nameSection}`}>
      <div className={`toolbar-settings toolbar-settings-${nameSection}`}>
        {listBtns &&
          listBtns.map((btn, i) => {
            return (
              <button
                className={`toolbar-btn toolbar-btn-${nameSection} toolbar--${btn}`}
                data-tooltip={btn}
                data-section={nameSection}
                key={i}
                ref={handleRef(btn)}
                onClick={(e) => handleClickToolbar(e, btn)}
                onMouseEnter={(e) => handleMouseEnter(e)}
                onMouseLeave={(e) => handleMouseLeave(e)}
              >
                {addIconToolbar(nameSection, btn)}
              </button>
            )
          })}
      </div>
      <div className="toolbar-cardtext-more">
        {toolbarColor && (
          <ToolbarColor
            color={toolbarColor.color}
            handleClickBtnToolbar={handleClickBtnToolbar}
          />
        )}
      </div>
    </div>
  )
}

export default Toolbar
