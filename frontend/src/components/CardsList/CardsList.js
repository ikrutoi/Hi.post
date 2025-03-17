import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TbArrowsMinimize } from 'react-icons/tb'
import { HiArrowsPointingIn, HiArrowsPointingOut } from 'react-icons/hi2'
import './CardsList.scss'
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
} from '../../utils/cardFormNav/indexDB/indexDb'
import EnvelopeMemory from './CardMiniSections/EnvelopeMemory/EnvelopeMemory'
import { colorSchemeMain } from '../../data/main/colorSchemeMain'
// import sizeMiniCard

const CardsList = () => {
  const sectionCardEdit = useSelector((state) => state.cardEdit)
  const layoutActiveEnvelope = useSelector(
    (state) => state.layout.activeSections.envelope
  )
  const layoutIndexDb = useSelector((state) => state.layout.indexDb)
  const sizeMiniCard = useSelector((state) => state.layout.sizeMiniCard)
  const choiceSection = useSelector((state) => state.layout.choiceSection)
  const infoEnvelopeSave = useSelector(
    (state) => state.infoButtons.envelopeSave
  )
  const infoEnvelopeClip = useSelector(
    (state) => state.infoButtons.envelopeClip
  )
  const listSelectedSections = []
  const [allCardMini, setAllCardMini] = useState(false)
  const [minimize, setMinimize] = useState(null)
  const [stylePolyCard, setStylePolyCard] = useState({
    filter: {},
    icon: {},
  })
  let count = 0
  const [memoryAddress, setMemoryAddress] = useState({
    myaddress: null,
    toaddress: null,
  })
  const addressRefs = useRef({})
  const dispatch = useDispatch()

  useEffect(() => {
    if (infoEnvelopeSave) {
      getAddress(infoEnvelopeSave)
      dispatch(infoButtons({ envelopeSave: false }))
    }
    if (infoEnvelopeClip) {
      getAddress(infoEnvelopeClip)
    }
  }, [infoEnvelopeSave, infoEnvelopeClip, dispatch])

  const getAddress = async (section) => {
    const listAddress = await getAllRecordsAddresses(
      section === 'myaddress' ? 'myAddress' : 'toAddress'
    )
    setMemoryAddress((state) => {
      return {
        ...state,
        [section]: listAddress,
      }
    })
  }

  const setRef = (id) => (element) => {
    addressRefs.current[id] = element
  }

  for (let section in sectionCardEdit) {
    if (!!sectionCardEdit[section]) {
      switch (section) {
        case 'cardphoto':
          if (
            Object.keys(layoutIndexDb).length !== 0 &&
            (layoutIndexDb.hiPostImages.miniImage ||
              layoutIndexDb.userImages.miniImage)
          ) {
            listSelectedSections.push({ section, position: 0, index: 4 })
            count++
          }
          break
        case 'cardtext':
          if (sectionCardEdit[section].text[0].children[0].text) {
            listSelectedSections.push({ section, position: 1, index: 3 })
            count++
          }
          break
        case 'envelope':
          if (
            sectionCardEdit[section].toaddress.street !== '' &&
            sectionCardEdit[section].toaddress.index !== '' &&
            sectionCardEdit[section].toaddress.city !== '' &&
            sectionCardEdit[section].toaddress.country !== '' &&
            sectionCardEdit[section].toaddress.name !== ''
          ) {
            listSelectedSections.push({ section, position: 2, index: 2 })
            count++
            if (!layoutActiveEnvelope) {
              dispatch(activeSections({ envelope: true }))
            }
          } else {
            if (layoutActiveEnvelope) {
              dispatch(activeSections({ envelope: false }))
            }
          }
          break
        case 'date':
          if (sectionCardEdit[section]) {
            listSelectedSections.push({ section, position: 3, index: 1 })
            count++
          }
          break
        case 'aroma':
          if (sectionCardEdit[section]) {
            listSelectedSections.push({ section, position: 4, index: 0 })
            count++
          }
          break
        default:
          break
      }
    }
  }

  const listSortSelectedSections = listSelectedSections.sort(
    (a, b) => a.position - b.position
  )

  useEffect(() => {
    if (count === 5) {
      setAllCardMini(true)
      setStylePolyCard((state) => {
        return {
          ...state,
          // filter: {
          //   ...state.icon,
          //   backgroundColor: 'rgba(0, 125, 250, 0.4)',
          // },
          icon: {
            ...state.icon,
            backgroundColor: 'rgba(0, 125, 250, 0.4)',
            color: colorSchemeMain.lightGray,
            cursor: 'pointer',
          },
        }
      })
    } else {
      setAllCardMini(false)
      setStylePolyCard((state) => {
        return {
          ...state,
          // filter: {
          //   ...state.icon,
          //   backgroundColor: 'rgba(163, 163, 163, 0.4)',
          // },
          icon: {
            ...state.icon,
            backgroundColor: 'rgba(163, 163, 163, 0.4)',
            color: 'rgba(240, 240, 240, 1)',
            cursor: 'default',
          },
        }
      })
    }
  }, [count])

  const getListPrioritySections = () => {
    const temporaryArray = []
    for (let i = 0; i < listSortSelectedSections.length; i++) {
      if (listSortSelectedSections[i].section !== choiceSection.nameSection) {
        temporaryArray.push(listSortSelectedSections[i])
      } else {
        temporaryArray.unshift(...listSortSelectedSections.slice(i))
        break
      }
    }
    return temporaryArray
  }
  const listPrioritySections = getListPrioritySections()

  const handleClickAddressMiniKebab = async (section, id) => {
    await deleteRecordAddress(
      section === 'myaddress' ? 'myAddress' : 'toAddress',
      id
    )
    getAddress(section)
    dispatch(infoButtons({ miniAddressClose: section }))
  }

  const handleClickAddress = (section, id) => {
    dispatch(choiceAddress({ section, id }))
  }

  const handleClickIconMinimize = () => {
    if (listSortSelectedSections.length === 5) {
      minimize ? setMinimize(false) : setMinimize(true)
    }
    // const searchParentBtnNav = (el) => {
    //   if (el.classList.contains('icon-minimize-container')) {
    //     return el
    //   } else if (el.parentElement) {
    //     return searchParentBtnNav(el.parentElement)
    //   }
    //   return null
    // }

    // const parentElement = searchParentBtnNav(evt.target)
  }

  const handleMouseEnterIconMinimize = () => {
    if (allCardMini) {
      setStylePolyCard((state) => {
        return {
          ...state,
          icon: {
            ...state.icon,
            backgroundColor: 'rgba(0, 125, 250, 0.6)',
          },
        }
      })
    }
  }

  const handleMouseLeaveIconMinimize = () => {
    if (allCardMini) {
      setStylePolyCard((state) => {
        return {
          ...state,
          icon: {
            ...state.icon,
            backgroundColor: 'rgba(0, 125, 250, 0.4)',
          },
        }
      })
    }
  }

  return (
    <div className="cards-list">
      <div style={{ height: `${sizeMiniCard.height}px` }}></div>
      {infoEnvelopeClip && choiceSection.nameSection === 'envelope' && (
        <div className="envelope-memory">
          {infoEnvelopeClip &&
            memoryAddress[infoEnvelopeClip] &&
            memoryAddress[infoEnvelopeClip].map((address, i) => (
              <EnvelopeMemory
                key={i}
                setRef={setRef}
                sizeMiniCard={sizeMiniCard}
                section={infoEnvelopeClip}
                address={address}
                handleClickAddressMiniKebab={handleClickAddressMiniKebab}
                handleClickAddress={handleClickAddress}
              />
            ))}
        </div>
      )}

      {(!infoEnvelopeClip || choiceSection.nameSection !== 'envelope') && (
        <>
          <div
            className="poly-cards-filter"
            style={{
              width: `${sizeMiniCard.width}px`,
              height: `${sizeMiniCard.height}px`,
              backgroundColor: 'rgba(163, 163, 163, 0.2)',
              boxShadow: minimize
                ? '2px 1px 5px 2px rgba(34, 60, 80, 0.3)'
                : '2px 1px 5px 2px rgba(255, 255, 255, 0.2)',
              transition: 'box-shadow 0.3s',
            }}
          ></div>
          <div
            className="mini-poly-cards"
            style={{
              width: `${sizeMiniCard.width + (sizeMiniCard.width * 4) / 24}px`,
              height: `${sizeMiniCard.height}px`,
            }}
          >
            <div
              className="icon-minimize-container"
              style={{
                color: stylePolyCard.icon.color,
                backgroundColor: stylePolyCard.icon.backgroundColor,
                cursor: stylePolyCard.icon.cursor,
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onClick={handleClickIconMinimize}
              onMouseEnter={handleMouseEnterIconMinimize}
              onMouseLeave={handleMouseLeaveIconMinimize}
            >
              {minimize && listSortSelectedSections.length === 5 ? (
                <HiArrowsPointingOut className="icon-minimize" />
              ) : (
                <HiArrowsPointingIn className="icon-minimize" />
              )}
            </div>
          </div>
          {listSortSelectedSections.length !== 0 ? (
            listSortSelectedSections.map((selectedSection, i, arr) => (
              <CardMiniSection
                key={`card-mini-${selectedSection.section}-${i}`}
                valueSection={sectionCardEdit[selectedSection.section]}
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
