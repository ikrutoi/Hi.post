import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { openDB } from 'idb'
import './Toolbar.scss'
import listNavBtnsCardtext from '../../../../data/cardtext/list-textarea-nav-btns.json'
import listNavBtnsCardphoto from '../../../../data/cardphoto/list-toolbar-cardphoto.json'
import ToolbarColor from './ToolbarColor/ToolbarColor'
import {
  addCardphoto,
  addCardtext,
} from '../../../../redux/cardEdit/actionCreators'
import { addIconToolbarCardtext } from '../../../../utils/cardFormNav/addIconToolbarCardtext.js'
import { addIconToolbarCardphoto } from '../../../../utils/cardFormNav/addIconToolbarCardphoto.js'
// import { useIndexedDB } from '../../../../data/cardFormNav/useIndexedDB.js'
// import { addChoiceSection } from '../../../../redux/layout/actionCreators.js'

const Toolbar = ({ nameSection, handleClickBtnToolbar }) => {
  const layoutBtnToolbar = useSelector((state) => state.layout.btnToolbar)
  const infoButtons = useSelector((state) => state.infoButtons)
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

  const handleClickToolbar = async (evt, i, section) => {
    handleClickBtnToolbar(evt)
    const searchParentBtnNav = (el) => {
      if (el.classList.contains('toolbar-btn')) {
        return el
      } else if (el.parentElement) {
        return searchParentBtnNav(el.parentElement)
      }
      return null
    }

    const parentBtnNav = searchParentBtnNav(evt.target)

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

  // const readFilesFromDB = async (db) => {
  //   const tx = db.transaction('files', 'readonly')
  //   const store = tx.objectStore('files')
  //   const allFiles = await store.getAll()
  //   console.log('Files in DB:', allFiles)
  //   return allFiles
  // }

  // const db = useIndexedDB()
  // const fileInputRef = useRef(null)

  // const addFileToDB = async (db, file) => {
  //   const tx = db.transaction('files', 'readwrite')
  //   const store = tx.objectStore('files')
  //   await store.clear()
  //   await store.add(file)
  //   await tx.done
  //   const url = URL.createObjectURL(file)
  //   dispatch(addCardphoto({ url, source: 'user' }))
  //   dispatch(
  //     addChoiceSection({ source: 'cardPuzzle', nameSection: 'cardphoto' })
  //   )
  // }

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0]
  //   if (db) {
  //     await addFileToDB(db, file)
  //   }
  // }

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

  const checkInfoButtons = (nameBtn) => {
    if (nameBtn in infoButtons) {
      if (infoButtons[nameBtn]) {
        return true
      } else {
        return false
      }
    }
  }

  const handleMouseEnter = (e) => {
    if (e.target.dataset.tooltip === 'save') {
      if (!infoButtons.crop) {
        e.target.style.color = 'rgb(163, 163, 163)'
        e.target.style.cursor = 'default'
      } else {
        e.target.style.color = 'rgb(71, 71, 71)'
        e.target.style.cursor = 'pointer'
      }
    } else {
      e.target.style.color = 'rgb(71, 71, 71)'
      e.target.style.cursor = 'pointer'
    }
  }

  const handleMouseLeave = (e) => {
    if (e.target.dataset.tooltip === 'crop' && infoButtons.crop) {
      e.target.style.color = 'rgb(71, 71, 71)'
    } else {
      e.target.style.color = 'rgb(163, 163, 163)'
    }
  }

  const handleRef = (name) => (element) => {
    btnRefs.current[name] = element
  }

  useEffect(() => {
    if (!infoButtons.crop && Object.keys(btnRefs.current).length !== 0) {
      btnRefs.current.save.style.color = 'rgb(163, 163, 163)'
      btnRefs.current.save.style.cursor = 'default'
    }
  }, [infoButtons.crop, btnRefs])

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
                onClick={(e) => handleClickToolbar(e, i, nameSection)}
                style={{
                  color: checkInfoButtons(btn)
                    ? 'rgb(71, 71, 71)'
                    : 'rgb(163, 163, 163)',
                }}
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
