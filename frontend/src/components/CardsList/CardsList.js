import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TbArrowsMinimize } from 'react-icons/tb'
import { MdMoreHoriz } from 'react-icons/md'
import './CardsList.scss'
import { addAroma } from '../../redux/cardEdit/actionCreators'
import {
  choiceMemorySection,
  fullCard,
} from '../../redux/layout/actionCreators'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import { infoButtons } from '../../redux/infoButtons/actionCreators'
import {
  choiceAddress,
  activeSections,
} from '../../redux/layout/actionCreators'
import {
  deleteMyAddress,
  deleteToAddress,
  getAllRecordsAddresses,
  deleteRecordAddress,
  getAllRecordCardtext,
  deleteRecordCardtext,
  addUniqueCard,
} from '../../utils/cardFormNav/indexDB/indexDb'
import { colorSchemeMain } from '../../data/main/colorSchemeMain'
import MemoryEnvelope from './CardMiniSections/MemoryEnvelope/MemoryEnvelope'
import MemoryCardtext from './CardMiniSections/MemoryCardtext/MemoryCardtext'
import { addIconToolbar } from '../../data/toolbar/addIconToolbar'

const CardsList = () => {
  const layoutFullCard = useSelector((state) => state.layout.fullCard)
  const cardEdit = useSelector((state) => state.cardEdit)
  const layoutActiveSections = useSelector(
    (state) => state.layout.activeSections
  )
  const choiceSave = useSelector((state) => state.layout.choiceSave)
  const choiceClip = useSelector((state) => state.layout.choiceClip)
  const layoutIndexDb = useSelector((state) => state.layout.indexDb)
  const sizeMiniCard = useSelector((state) => state.layout.sizeMiniCard)
  const choiceSection = useSelector((state) => state.layout.choiceSection)
  const infoEnvelopeSave = useSelector(
    (state) => state.infoButtons.envelopeSave
  )
  const [listActiveSections, setListActiveSections] = useState([])
  const [minimize, setMinimize] = useState(null)
  const [stylePolyCards, setStylePolyCards] = useState({
    filter: {},
    icon: {},
    iconArrows: {},
    iconPlus: {},
  })
  const [memoryList, setMemoryList] = useState(null)
  const [memoryAddress, setMemoryAddress] = useState({
    myaddress: null,
    toaddress: null,
  })
  const [memoryCardtext, setMemoryCardtext] = useState({ cardtext: null })
  const [showIconMinimize, setShowIconMinimize] = useState(minimize)
  const memoryRefs = useRef({})
  const dispatch = useDispatch()
  const listIconsFullCard = ['plus', 'delete']
  const listSections = ['cardphoto', 'cardtext', 'envelope', 'date', 'aroma']

  useEffect(() => {
    if (choiceSection.nameSection === 'envelope') {
      if (infoEnvelopeSave) {
        getAllAddress(infoEnvelopeSave)
        dispatch(infoButtons({ envelopeSave: false }))
      }
    }
    if (choiceSection.nameSection === 'cardtext') {
      if (choiceSave === 'cardtext') {
        getAllCardtext()
        setMemoryList('cardtext')
      }
    }
  }, [choiceSection, infoEnvelopeSave, choiceSave, dispatch])

  useEffect(() => {
    setMemoryList(choiceClip)
    switch (choiceClip) {
      case 'myaddress':
        getAllAddress('myaddress')
        break
      case 'toaddress':
        getAllAddress('toaddress')
        break
      case 'cardtext':
        getAllCardtext()
        break

      default:
        break
    }
  }, [choiceSave, choiceClip])

  const getAllAddress = async (section) => {
    const listAddress = await getAllRecordsAddresses(
      section === 'myaddress' ? 'myAddress' : 'toAddress'
    )
    setMemoryAddress((state) => {
      return {
        ...state,
        [section]: listAddress,
      }
    })
    setMemoryList(section)
  }

  const getAllCardtext = async () => {
    const listCardtexts = await getAllRecordCardtext()
    setMemoryCardtext((state) => {
      return {
        ...state,
        cardtext: listCardtexts,
      }
    })
  }

  const setRef = (id) => (element) => {
    memoryRefs.current[id] = element
  }

  useEffect(() => {
    const baseSections = {
      cardphoto: { section: 'cardphoto', position: 0, index: 4 },
      cardtext: { section: 'cardtext', position: 1, index: 3 },
      envelope: { section: 'envelope', position: 2, index: 2 },
      date: { section: 'date', position: 3, index: 1 },
      aroma: { section: 'aroma', position: 4, index: 0 },
    }

    const listSections = []

    for (let section in layoutActiveSections) {
      if (layoutActiveSections[section]) {
        listSections.push(baseSections[section])
      }
    }

    const sortListSections = listSections.sort(
      (a, b) => a.position - b.position
    )

    setListActiveSections(sortListSections)
  }, [layoutActiveSections])

  useEffect(() => {
    if (listActiveSections.length === 5) {
      setStylePolyCards((state) => {
        return {
          // ...state,
          // icon: {
          //   ...state.icon,
          //   backgroundColor: 'rgba(0, 125, 215, 0.85)',
          //   color: colorSchemeMain.lightGray,
          //   cursor: 'pointer',
          // },
          iconArrows: {
            ...state.iconArrows,
            backgroundColor: 'rgba(0, 125, 215, 0.85)',
            color: colorSchemeMain.lightGray,
            cursor: 'pointer',
          },
          iconPlus: {
            ...state.iconPlus,
            backgroundColor: 'rgba(240, 240, 240, 0.85)',
            color: colorSchemeMain.gray,
            cursor: 'pointer',
          },
        }
      })
    } else {
      setStylePolyCards((state) => {
        return {
          ...state,
          icon: {
            ...state.icon,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            color: 'rgba(255, 255, 255, 0)',
            cursor: 'default',
          },
          iconArrows: {
            ...state.iconArrows,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            color: 'rgba(255, 255, 255, 0)',
            cursor: 'default',
          },
          iconPlus: {
            ...state.iconPlus,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            color: 'rgba(255, 255, 255, 0)',
            cursor: 'default',
          },
        }
      })
    }
  }, [listActiveSections])

  // const getListPrioritySections = () => {
  //   const temporaryArray = []
  //   for (let i = 0; i < listSortSelectedSections.length; i++) {
  //     if (listSortSelectedSections[i].section !== choiceSection.nameSection) {
  //       temporaryArray.push(listSortSelectedSections[i])
  //     } else {
  //       temporaryArray.unshift(...listSortSelectedSections.slice(i))
  //       break
  //     }
  //   }
  //   return temporaryArray
  // }
  // const listPrioritySections = getListPrioritySections()

  const handleClickMiniKebab = async (evt, section, id) => {
    evt.stopPropagation()
    switch (section) {
      case 'cardtext':
        await deleteRecordCardtext(id)
        getAllCardtext()
        break
      case 'myaddress':
        await deleteRecordAddress('myAddress', id)
        getAllAddress(section)
        break
      case 'toaddress':
        await deleteRecordAddress('toAddress', id)
        getAllAddress(section)
        break
      case 'aroma':
        dispatch(addAroma(null))
        break

      default:
        break
    }
  }

  const handleClickAddress = (section, id) => {
    dispatch(choiceAddress({ section, id }))
  }

  const handleClickCardtext = (id) => {
    dispatch(choiceMemorySection({ section: 'cardtext', id }))
  }

  const handleClickIconMinimize = () => {
    if (listActiveSections.length === 5) {
      minimize ? setMinimize(false) : setMinimize(true)
    }
  }

  const handleClickFullCardIcon = async (evt) => {
    const parentBtn = evt.target.closest('.fullcard-btn')
    // console.log('parent', parentBtn)
    switch (parentBtn.dataset.tooltip) {
      case 'plus':
        const resultCard = {}
        listSections.forEach((section) => {
          resultCard[section] = cardEdit[section]
        })
        // console.log('resultCard', resultCard)
        // setResultFullCard()
        await addUniqueCard(resultCard)
        break

      default:
        break
    }
  }

  // const handleMouseEnterIconMinimize = () => {
  //   if (listActiveSections.length === 5) {
  //     setStylePolyCards((state) => {
  //       return {
  //         ...state,
  //         icon: {
  //           ...state.icon,
  //           backgroundColor: 'rgba(0, 125, 215, 0.95)',
  //         },
  //       }
  //     })
  //   }
  // }

  // const handleMouseLeaveIconMinimize = () => {
  //   if (listActiveSections.length === 5) {
  //     setStylePolyCards((state) => {
  //       return {
  //         ...state,
  //         icon: {
  //           ...state.icon,
  //           backgroundColor: 'rgba(0, 125, 215, 0.85)',
  //         },
  //       }
  //     })
  //   }
  // }

  useEffect(() => {
    dispatch(fullCard(minimize))
    const timerIcon = setTimeout(() => {
      setShowIconMinimize(minimize)
    }, 800)

    return () => clearTimeout(timerIcon)
  }, [minimize])

  const choiceMemoryList = () => {
    if (memoryList === 'myaddress' || memoryList === 'toaddress') {
      return (
        <div className="memory-list">
          {memoryAddress[memoryList] &&
            memoryAddress[memoryList].map((address, i) => (
              <MemoryEnvelope
                key={`${memoryList}-${i}`}
                setRef={setRef}
                sizeMiniCard={sizeMiniCard}
                section={memoryList}
                address={address}
                handleClickMiniKebab={handleClickMiniKebab}
                handleClickAddress={handleClickAddress}
              />
            ))}
        </div>
      )
    }
    if (memoryList === 'cardtext') {
      return (
        <div className="memory-list">
          {memoryCardtext.cardtext &&
            memoryCardtext.cardtext.map((text, i) => (
              <MemoryCardtext
                key={`cardtext-${i}`}
                setRef={setRef}
                sizeMiniCard={sizeMiniCard}
                text={text}
                handleClickMiniKebab={handleClickMiniKebab}
                handleClickCardtext={handleClickCardtext}
              />
            ))}
        </div>
      )
    }
  }

  // const showIconFullCard = (icon) => {
  //   switch (icon) {
  //     case 'plus':
  //       return <FiPlus className="fullcard-icon" />
  //     case 'delete':
  //       return
  //     default:
  //       break
  //   }
  // }

  return (
    <div className="cards-list">
      <div style={{ height: `${sizeMiniCard.height}px` }}></div>
      {choiceMemoryList()}
      {!memoryList && (
        <>
          <div
            className="poly-cards-filter"
            style={{
              width: `${sizeMiniCard.width}px`,
              height: `${sizeMiniCard.height}px`,
              boxShadow: minimize
                ? '2px 1px 5px 2px rgba(34, 60, 80, 0.3)'
                : '2px 1px 5px 2px rgba(255, 255, 255, 0.2)',
              transition: 'box-shadow 0.3s',
            }}
          ></div>
          <div
            className="mini-poly-cards"
            style={{
              width: `${sizeMiniCard.width}px`,
              height: `${sizeMiniCard.height}px`,
            }}
          >
            <div className="fullcard-icons-container">
              <div className="fullcard-line">
                <div className="fullcard-btn"></div>
              </div>
              <div className="fullcard-line">
                <button
                  className="fullcard-btn"
                  style={{
                    color: stylePolyCards.iconArrows.color,
                    backgroundColor: stylePolyCards.iconArrows.backgroundColor,
                    cursor: stylePolyCards.iconArrows.cursor,
                    transition:
                      'background-color 0.3s ease, color 0.3s ease, left 0.3s ease',
                  }}
                  onClick={handleClickIconMinimize}
                  // onMouseEnter={handleMouseEnterIconMinimize}
                  // onMouseLeave={handleMouseLeaveIconMinimize}
                >
                  {showIconMinimize
                    ? addIconToolbar('arrowsOut')
                    : addIconToolbar('arrowsIn')}
                </button>
              </div>
              <div className="fullcard-line">
                {listIconsFullCard.map((icon, i) => {
                  return (
                    <button
                      key={`${icon}-${i}`}
                      className="fullcard-btn"
                      data-tooltip={icon}
                      style={{
                        color: layoutFullCard
                          ? stylePolyCards.iconPlus.color
                          : 'rgba(255, 255, 255, 0)',
                        backgroundColor:
                          showIconMinimize && layoutFullCard
                            ? stylePolyCards.iconPlus.backgroundColor
                            : 'rgba(255, 255, 255, 0)',
                        cursor: layoutFullCard
                          ? stylePolyCards.iconPlus.cursor
                          : 'default',
                        transition:
                          'background-color 0.3s ease, color 0.3s ease, right 0.3s ease',
                      }}
                      onClick={handleClickFullCardIcon}
                    >
                      {showIconMinimize ? addIconToolbar(icon) : <></>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          {listActiveSections.length !== 0 ? (
            listActiveSections
              .filter(
                (selectedSection) => cardEdit[selectedSection.section] !== null
              )
              .map((selectedSection, i, arr) => (
                <CardMiniSection
                  key={`card-mini-${selectedSection.section}-${i}`}
                  valueSection={cardEdit[selectedSection.section]}
                  sizeCardMini={sizeMiniCard}
                  infoSection={{
                    section: selectedSection,
                    i,
                    length: arr.length,
                  }}
                  minimize={minimize}
                />
              ))
          ) : (
            <span></span>
          )}
        </>
      )}
    </div>
  )
}

export default CardsList
