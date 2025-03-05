import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { TbArrowsMinimize } from 'react-icons/tb'
import { HiArrowsPointingIn } from 'react-icons/hi2'
import './CardsList.scss'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import {
  deleteMyAddress,
  deleteToAddress,
  getAllRecordsAddresses,
} from '../../utils/cardFormNav/indexDB/indexDb'
import EnvelopeMemory from './CardMiniSections/EnvelopeMemory/EnvelopeMemory'
// import sizeMiniCard

const CardsList = () => {
  const sectionCardEdit = useSelector((state) => state.cardEdit)
  const layoutIndexDb = useSelector((state) => state.layout.indexDb)
  const sizeMiniCard = useSelector((state) => state.layout.sizeMiniCard)
  const choiceSection = useSelector((state) => state.layout.choiceSection)
  const infoEnvelopeClipMyAddress = useSelector(
    (state) => state.infoButtons.envelopeClipMyAddress
  )
  const infoEnvelopeClipToAddress = useSelector(
    (state) => state.infoButtons.envelopeClipToAddress
  )
  const infoEnvelopeSaveMyAddress = useSelector(
    (state) => state.infoButtons.envelopeSaveMyAddress
  )
  const infoEnvelopeSaveToAddress = useSelector(
    (state) => state.infoButtons.envelopeSaveToAddress
  )
  const iconMinimizeContainerRef = useRef()
  const [styleIconMinimize, setStyleIconMinimize] = useState(null)
  const listSelectedSections = []
  const [allCardMini, setAllCardMini] = useState(false)
  let count = 0
  const [memoryMyAddress, setMemoryMyAddress] = useState(null)
  const [memoryToAddress, setMemoryToAddress] = useState(null)
  const addressRefs = useRef({})

  useEffect(() => {
    if (infoEnvelopeSaveMyAddress) {
      getAddress('myaddress')
    }
    if (infoEnvelopeSaveToAddress) {
      getAddress('toaddress')
    }
  }, [infoEnvelopeSaveMyAddress, infoEnvelopeSaveToAddress])

  const getAddress = async (section) => {
    switch (section) {
      case 'myaddress':
        const myAddress = await getAllRecordsAddresses('myAddress')
        setMemoryMyAddress(myAddress)
        break
      case 'toaddress':
        const toAddress = await getAllRecordsAddresses('toAddress')
        setMemoryToAddress(toAddress)
        break
      default:
        break
    }
  }

  const setRef = (id) => (element) => {
    addressRefs.current[id] = element
  }

  // const getAllAddress = async () => {
  //   const myAddress = await getAllMyAddress('myAddress')
  //   setMemoryMyAddress(myAddress)
  //   const toAddress = await getAllToAddress('toAddress')
  //   setMemoryToAddress(toAddress)
  // }

  useEffect(() => {
    if (infoEnvelopeClipMyAddress) {
      getAddress('myaddress')
    }
    if (infoEnvelopeClipToAddress) {
      getAddress('toaddress')
    }
  }, [infoEnvelopeClipMyAddress, infoEnvelopeClipToAddress])

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
            sectionCardEdit[section].toaddress.street !== '' ||
            sectionCardEdit[section].toaddress.index !== '' ||
            sectionCardEdit[section].toaddress.city !== '' ||
            sectionCardEdit[section].toaddress.country !== '' ||
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
    switch (section) {
      case 'myaddress':
        await deleteMyAddress(id)
        break
      case 'toaddress':
        await deleteToAddress(id)
        break

      default:
        break
    }
    getAddress(section)
  }

  // console.log('toAddress', memoryToAddress)

  return (
    <div className="cards-list" style={{ height: `${sizeMiniCard.height}px` }}>
      {(infoEnvelopeClipMyAddress || infoEnvelopeClipToAddress) && (
        <div className="envelope-memory">
          {infoEnvelopeClipMyAddress &&
            memoryToAddress &&
            memoryMyAddress.map((address, i) => (
              <EnvelopeMemory
                key={i}
                setRef={setRef}
                // index={i}
                sizeMiniCard={sizeMiniCard}
                section={'myaddress'}
                address={address}
                handleClickAddressMiniKebab={handleClickAddressMiniKebab}
              />
            ))}
          {infoEnvelopeClipToAddress &&
            memoryToAddress &&
            memoryToAddress.map((address, i) => (
              <EnvelopeMemory
                key={i}
                setRef={setRef}
                // index={i}
                sizeMiniCard={sizeMiniCard}
                section={'toaddress'}
                address={address}
                handleClickAddressMiniKebab={handleClickAddressMiniKebab}
              />
            ))}
        </div>
      )}

      {!infoEnvelopeClipMyAddress && !infoEnvelopeClipToAddress && (
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
