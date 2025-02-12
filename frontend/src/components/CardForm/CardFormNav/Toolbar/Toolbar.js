import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openDB } from 'idb'
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
import { useIndexedDB } from '../../../../data/cardFormNav/useIndexedDB.js'
import imgStart from '../../../../data/cardphoto/photo-start-1206-862.jpg'
import { addChoiceSection } from '../../../../redux/layout/actionCreators.js'

const Toolbar = ({
  nameSection,
  setToolbarColorActive,
  // handleClickToolbar,
  // handleClickColor,
  toolbarColor,
}) => {
  const selectorCardphoto = useSelector((state) => state.cardEdit.cardphoto)
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

  const handleClickToolbar = async (evt, i, section) => {
    const searchParentBtnNav = (el) => {
      if (el.classList.contains('toolbar-btn')) {
        return el
      } else if (el.parentElement) {
        return searchParentBtnNav(el.parentElement)
      }
      return null
    }

    const parentBtnNav = searchParentBtnNav(evt.target)

    // handleClickBtnNav(parentBtnNav)
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

    if (section === 'cardphoto') {
      // dispatch(addCardphoto({ btn: btnTooltip }))

      switch (btnTooltip) {
        case 'download':
          fileInputRef.current.click()
          break
        case 'delete':
          dispatch(addCardphoto({ url: null, source: null }))
          break
        case 'save':
          if (selectorCardphoto.source === null) {
            dispatch(addCardphoto({ url: imgStart, source: 'startImg' }))
            dispatch(
              addChoiceSection({
                source: 'cardPuzzle',
                nameSection: 'cardphoto',
              })
            )
          } else {
            break
          }
          break

        default:
          break
      }

      // const formData = new FormData()
      // formData.append('file', selectedFile)

      // try {
      //   const response = await fetch('/upload', {
      //     method: 'POST',
      //     body: formData,
      //   })

      //   if (response.ok) {
      //     alert('File uploaded successfully')
      //   } else {
      //     alert('Error loading file 0')
      //   }
      // } catch (error) {
      //   alert('Error loading file ' + error.message)
      // }
    }

    // switch (btnTooltip) {
    //   case 'download':
    //     dispatch(addCardphoto({icon: btnTooltip}))
    //     break;

    //   default:
    //     break;
    // }
    // }
  }

  const readFilesFromDB = async (db) => {
    const tx = db.transaction('files', 'readonly')
    const store = tx.objectStore('files')
    const allFiles = await store.getAll()
    console.log('Files in DB:', allFiles)
    return allFiles
  }

  const db = useIndexedDB()
  const fileInputRef = useRef(null)

  const addFileToDB = async (db, file) => {
    const tx = db.transaction('files', 'readwrite')
    const store = tx.objectStore('files')
    await store.clear()
    await store.add(file)
    await tx.done
    const url = URL.createObjectURL(file)
    dispatch(addCardphoto({ url, source: 'user' }))
    dispatch(
      addChoiceSection({ source: 'cardPuzzle', nameSection: 'cardphoto' })
    )
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (db) {
      await addFileToDB(db, file)
    }
  }

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
          listBtns.map((btn, i) => {
            if (btn === 'download') {
              return (
                <button
                  className={`toolbar-btn toolbar-btn-${nameSection} toolbar--${btn}`}
                  data-tooltip={btn}
                  key={i}
                  // ref={btnRefs.current[i]}
                  onClick={(event) => handleClickToolbar(event, i, nameSection)}
                  // onMouseEnter={handleMouseEnter}
                  // onMouseLeave={handleMouseLeave}
                >
                  <input
                    ref={fileInputRef}
                    className="cardformnav-toolbar-input"
                    id="file-input"
                    key={`input-${i}`}
                    type="file"
                    onChange={handleFileChange}
                  ></input>
                  {addIconToolbar(nameSection, btn)}
                </button>
              )
            }
            return (
              <button
                className={`toolbar-btn toolbar-btn-${nameSection} toolbar--${btn}`}
                data-tooltip={btn}
                key={i}
                // ref={btnRefs.current[i]}
                onClick={(event) => handleClickToolbar(event, i, nameSection)}
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
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
            // handleClickColor={handleClickColor}
          />
        )}
      </div>
    </div>
  )
}

export default Toolbar
