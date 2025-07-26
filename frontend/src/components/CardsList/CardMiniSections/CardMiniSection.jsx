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
import { addIconToolbar } from '../../../data/toolbar/addIconToolbar'

const CardMiniSection = ({
  valueSection,
  sizeCardMini,
  infoSection,
  minimize,
  infoMinimize,
  showIconMinimize,
}) => {
  const remSize = useSelector((state) => state.layout.remSize)
  const dispatch = useDispatch()
  const cardMiniSectionRef = useRef(null)
  const [showIcon, setShowIcon] = useState(minimize)

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

  useEffect(() => {
    if (infoMinimize && !showIconMinimize) {
      const timerIcon = setTimeout(() => {
        setShowIcon(true)
      }, infoSection.i * 150)
      return () => clearTimeout(timerIcon)
    }
    if (!infoMinimize && !showIconMinimize) {
      setShowIcon(true)
    } else {
      setShowIcon(false)
    }
  }, [showIconMinimize, infoMinimize, infoSection])

  return (
    <div
      className={`card-mini-section card-mini-${infoSection.section.section}`}
      style={{
        left: minimize
          ? '0'
          : `${
              sizeCardMini.width +
              remSize +
              (sizeCardMini.width * 4) / 24 +
              (sizeCardMini.width + remSize) * infoSection.i
            }px`,
        padding: infoSection.section.section === 'cardphoto' ? '0' : '0.5rem',
        width: `${sizeCardMini.width}px`,
        height: `${sizeCardMini.height}px`,
        boxShadow: minimize
          ? '2px 1px 5px 2px rgba(255, 255, 255, 0.2)'
          : '2px 1px 5px 2px rgba(34, 60, 80, 0.3)',
        zIndex: infoSection.section.index,
        transition: `left ${0.3 + 0.15 * infoSection.i}s ease, box-shadow 0.3s`,
      }}
      onClick={handleClickSection}
      data-section={infoSection.section.section}
      data-area="single"
      ref={cardMiniSectionRef}
    >
      {renderSection(infoSection.section.section, valueSection)}
      {!minimize && (
        <button
          className="card-mini-kebab"
          style={{
            color: showIcon ? 'rgba(71, 71, 71, 1)' : 'rgba(71, 71, 71, 0)',
            backgroundColor: showIcon
              ? 'rgba(240, 240, 240, 0.85'
              : 'rgba(240, 240, 240, 0)',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}
          onClick={handleClickCardMiniKebab}
        >
          {/* <CgClose className="icon-close" /> */}
          {addIconToolbar('remove')}
        </button>
      )}
    </div>
  )
}

export default CardMiniSection
