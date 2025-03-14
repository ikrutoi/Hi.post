import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TbArrowsMinimize } from 'react-icons/tb'
import { HiArrowsPointingIn } from 'react-icons/hi2'
import './CardsList.scss'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import { infoButtons } from '../../redux/infoButtons/actionCreators'
import { choiceAddress } from '../../redux/layout/actionCreators'
import {
  deleteMyAddress,
  deleteToAddress,
  getAllRecordsAddresses,
  deleteRecordAddress,
} from '../../utils/cardFormNav/indexDB/indexDb'
import EnvelopeMemory from './CardMiniSections/EnvelopeMemory/EnvelopeMemory'
// import sizeMiniCard

const CardsList = () => {
  const sectionCardEdit = useSelector((state) => state.cardEdit)
  const layoutIndexDb = useSelector((state) => state.layout.indexDb)
  const sizeMiniCard = useSelector((state) => state.layout.sizeMiniCard)
  const choiceSection = useSelector((state) => state.layout.choiceSection)
  const infoEnvelopeSave = useSelector(
    (state) => state.infoButtons.envelopeSave
  )
  const infoEnvelopeClip = useSelector(
    (state) => state.infoButtons.envelopeClip
  )
  const iconMinimizeContainerRef = useRef()
  const [styleIconMinimize, setStyleIconMinimize] = useState(null)
  const listSelectedSections = []
  const [allCardMini, setAllCardMini] = useState(false)
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
            listSelectedSections.push({ section, position: 0 })
            count++
          }
          break
        case 'cardtext':
          if (sectionCardEdit[section].text[0].children[0].text) {
            listSelectedSections.push({ section, position: 1 })
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
            listSelectedSections.push({ section, position: 2 })
            count++
          }
          break
        case 'date':
          if (sectionCardEdit[section]) {
            listSelectedSections.push({ section, position: 3 })
            count++
          }
          break
        case 'aroma':
          if (sectionCardEdit[section]) {
            listSelectedSections.push({ section, position: 4 })
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
    } else {
      setAllCardMini(false)
    }
  }, [count])

  const handleClickIconMinimize = () => {
    // const searchParentBtnNav = (el) => {
    //   if (el.classList.contains('icon-minimize-container')) {
    //     return el
    //   } else if (el.parentElement) {
    //     return searchParentBtnNav(el.parentElement)
    //   }
    //   return null
    // }

    // const parentElement = searchParentBtnNav(evt.target)

    console.log('click Minimize')
  }

  useEffect(() => {
    if (iconMinimizeContainerRef.current) {
      const left =
        (sizeMiniCard.width - iconMinimizeContainerRef.current.offsetWidth) / 2
      const top =
        (sizeMiniCard.height - iconMinimizeContainerRef.current.offsetHeight) /
        2
      setStyleIconMinimize({ left, top })
    }
  }, [iconMinimizeContainerRef, sizeMiniCard])

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
            className="mini-poly-cards"
            style={{
              width: `${sizeMiniCard.width + (sizeMiniCard.width * 4) / 12}px`,
              height: `${sizeMiniCard.height}px`,
              // display:
              //   (!infoEnvelopeClipMyAddress ? 'flex' : 'none') ||
              //   (!infoEnvelopeClipToAddress ? 'flex' : 'none'),
            }}
          >
            {allCardMini && (
              <span
                className="icon-minimize-container"
                ref={iconMinimizeContainerRef}
                style={{
                  left: `${styleIconMinimize ? styleIconMinimize.left : 0}px`,
                  top: `${styleIconMinimize ? styleIconMinimize.top : 0}px`,
                }}
                onClick={handleClickIconMinimize}
              >
                <HiArrowsPointingIn className="icon-minimize" />
              </span>
            )}
            {listPrioritySections.length !== 0 ? (
              listPrioritySections.map((selectedSection, i) => (
                <CardMiniSection
                  key={`mini-poly-${selectedSection.section}-${i}`}
                  sectionInfo={selectedSection}
                  valueSection={sectionCardEdit[selectedSection.section]}
                  sizeCardMini={sizeMiniCard}
                  // polyCards={listPrioritySections}
                  polyInfo={[listPrioritySections.length - i, i]}
                  choiceSection={choiceSection}
                />
              ))
            ) : (
              <div
                className="pattern-mini-card"
                style={{
                  width: `${sizeMiniCard.width}px`,
                  height: `${sizeMiniCard.height}px`,
                }}
              ></div>
            )}
          </div>
          {listSortSelectedSections.length !== 0 ? (
            listSortSelectedSections.map((selectedSection, i) => (
              <CardMiniSection
                key={`card-mini-${selectedSection.section}-${i}`}
                sectionInfo={selectedSection}
                valueSection={sectionCardEdit[selectedSection.section]}
                sizeCardMini={sizeMiniCard}
                // infoEnvelopeClipMyAddress={infoEnvelopeClipMyAddress}
                // infoEnvelopeClipToAddress={infoEnvelopeClipToAddress}
                polyInfo={false}
                choiceSection={choiceSection}
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
