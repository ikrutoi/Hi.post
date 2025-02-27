import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { CgClose } from 'react-icons/cg'
import './CardMiniSection.scss'
import {
  addAroma,
  addDate,
  addEnvelope,
  addCardtext,
} from '../../../redux/cardEdit/actionCreators'
import { addIndexDb } from '../../../redux/layout/actionCreators'
import {
  deleteHiPostImage,
  deleteUserImage,
} from '../../../utils/cardFormNav/indexDB/indexDb'
// import listLabelsMyAddress from '../../../../data/envelope/list-labels-my-address.json'
// import listLabelsToAddress from '../../../../data/envelope/list-labels-to-address.json'
import MiniCardtext from './MiniCardtext/MiniCardtext'
import MiniEnvelope from './MiniEnvelope/MiniEnvelope'
import MiniDate from './MiniDate/MiniDate'
import MiniAroma from './MiniAroma/MiniAroma'
import MiniPhoto from './MiniPhoto/MiniPhoto'
import { addChoiceSection } from '../../../redux/layout/actionCreators'
import listNavSections from '../../../data/cardsNav/navList.json'

const CardMiniSection = ({
  valueSection,
  sizeCardMini,
  polyInfo,
  sectionInfo,
  choiceSection,
}) => {
  const dispatch = useDispatch()
  const cardMiniSectionRef = useRef(null)
  const offsetXPolyMiniCards = sizeCardMini.width / 12

  const handleClickSection = (evt) => {
    const parentName = evt.target.closest('.card-mini-section').dataset.name
    dispatch(
      addChoiceSection({ source: 'miniCardPuzzle', nameSection: parentName })
    )
  }

  const [colorBkg, setColorBkg] = useState(null)

  useEffect(() => {
    if (choiceSection.nameSection !== sectionInfo.section) {
      const navSection = listNavSections.find(
        (el) => el.name.toLowerCase() === sectionInfo.section
      )
      if (navSection) {
        setColorBkg(navSection.colorRGBA)
      }
    } else {
      setColorBkg('rgba(255, 255, 255, 0)')
    }
  }, [polyInfo, sectionInfo, choiceSection.nameSection])

  const renderSection = (section, valueSection) => {
    switch (section) {
      case 'cardphoto':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniPhoto sizeCardMini={sizeCardMini} />
          </div>
        )
      case 'cardtext':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniCardtext
              heightMinicard={sizeCardMini.height}
              cardMiniSectionRef={cardMiniSectionRef.current}
            />
          </div>
        )
      case 'envelope':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniEnvelope />
          </div>
        )
      case 'date':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniDate
              valueSection={valueSection}
              heightMinicard={sizeCardMini.height}
            />
          </div>
        )
      case 'aroma':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniAroma
              valueSection={valueSection}
              heightMinicard={sizeCardMini.height}
            />
          </div>
        )
      default:
        break
    }
  }

  const cardtext = useSelector((state) => state.cardEdit.cardtext)

  const handleClickCardMiniKebab = async (evt) => {
    const searchParentBtnNav = (el) => {
      if (el.classList.contains('card-mini-section')) {
        return el
      } else if (el.parentElement) {
        return searchParentBtnNav(el.parentElement)
      }
      return null
    }

    const parentElement = searchParentBtnNav(evt.target)

    switch (parentElement.dataset.name) {
      case 'aroma':
        dispatch(addAroma(null))
        break
      case 'date':
        dispatch(addDate(null))
        break
      case 'envelope':
        dispatch(
          addEnvelope({
            myaddress: {
              street: '',
              index: '',
              city: '',
              country: '',
              name: '',
            },
            toaddress: {
              street: '',
              index: '',
              city: '',
              country: '',
              name: '',
            },
          })
        )
        break
      case 'cardphoto':
        await deleteHiPostImage('miniImage')
        await deleteUserImage('miniImage')
        dispatch(
          addIndexDb({
            hiPostImages: { miniImage: false },
            userImages: { miniImage: false },
          })
        )
        break
      case 'cardtext':
        dispatch(
          addCardtext({
            text: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '',
                  },
                ],
              },
            ],
          })
        )
        break

      default:
        break
    }
  }

  return (
    <div
      className={`card-mini-section card-mini-${sectionInfo.section}`}
      style={{
        left: polyInfo ? `${polyInfo[1] * offsetXPolyMiniCards}px` : '0',
        padding: sectionInfo.section === 'cardphoto' ? '0' : '0.5rem',
        width: `${sizeCardMini.width}px`,
        height: `${sizeCardMini.height}px`,
        zIndex: polyInfo ? polyInfo[0] : 0,
      }}
      onClick={handleClickSection}
      data-name={sectionInfo.section}
      ref={cardMiniSectionRef}
    >
      {renderSection(sectionInfo.section, valueSection)}
      <span
        className="card-mini-color-filter"
        style={{
          backgroundColor: colorBkg ? colorBkg : '',
        }}
      ></span>
      {polyInfo ? (
        <></>
      ) : (
        <div
          className="card-mini-kebab"
          onClick={(evt) => handleClickCardMiniKebab(evt)}
        >
          {/* <span className="mini-kebab-dots"> */}
          <CgClose className="icon-close" />
          {/* <span className="mini-kebab-icon"></span> */}
          {/* </span> */}
        </div>
      )}
    </div>
  )
}

export default CardMiniSection
