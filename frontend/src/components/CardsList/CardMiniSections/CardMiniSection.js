import { useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { CgClose } from 'react-icons/cg'
import './CardMiniSection.scss'
import {
  addAroma,
  addDate,
  addEnvelope,
  addCardtext,
} from '../../../redux/cardEdit/actionCreators'
import {
  addIndexDb,
  deleteSection,
  activeSections,
} from '../../../redux/layout/actionCreators'
import {
  deleteHiPostImage,
  deleteUserImage,
  getAllHiPostImages,
  getAllUserImages,
} from '../../../utils/cardFormNav/indexDB/indexDb'
import MiniCardtext from './MiniCardtext/MiniCardtext'
import MiniEnvelope from './MiniEnvelope/MiniEnvelope'
import MiniDate from './MiniDate/MiniDate'
import MiniAroma from './MiniAroma/MiniAroma'
import MiniPhoto from './MiniPhoto/MiniPhoto'
import { addChoiceSection } from '../../../redux/layout/actionCreators'
import { searchParent } from '../../../utils/searchParent'

const CardMiniSection = ({
  valueSection,
  sizeCardMini,
  polyInfo,
  sectionInfo,
  choiceSection,
  offsetXPolyMiniCards,
}) => {
  const dispatch = useDispatch()
  const cardMiniSectionRef = useRef(null)

  const handleClickSection = (evt) => {
    const areaCardsList = evt.target.closest('.card-mini-section').dataset.area
    if (areaCardsList === 'single') {
      const parentName =
        evt.target.closest('.card-mini-section').dataset.section
      dispatch(
        addChoiceSection({ source: 'miniCardPuzzle', nameSection: parentName })
      )
    }
  }

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

  const handleClickCardMiniKebab = async (evt) => {
    evt.stopPropagation()

    const parentElement = searchParent(evt.target, 'card-mini-section')

    dispatch(deleteSection(parentElement.dataset.section))
    dispatch(activeSections({ [parentElement.dataset.section]: false }))

    switch (parentElement.dataset.section) {
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
      className={`card-mini-section card-mini-${sectionInfo.section} ${
        polyInfo ? 'card-mini-poly' : 'card-mini-singly'
      }`}
      style={{
        left: polyInfo ? `${polyInfo[1] * offsetXPolyMiniCards}px` : '0',
        padding: sectionInfo.section === 'cardphoto' ? '0' : '0.5rem',
        width: `${sizeCardMini.width}px`,
        height: `${sizeCardMini.height}px`,
        zIndex: polyInfo ? polyInfo[0] : 0,
      }}
      onClick={handleClickSection}
      data-section={sectionInfo.section}
      data-area={polyInfo ? 'poly' : 'single'}
      ref={cardMiniSectionRef}
    >
      {renderSection(sectionInfo.section, valueSection)}
      {polyInfo ? (
        <></>
      ) : (
        <div className="card-mini-kebab" onClick={handleClickCardMiniKebab}>
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
