import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { TbArrowsMinimize } from 'react-icons/tb'
import { MdMoreHoriz } from 'react-icons/md'
import './CardsList.scss'
import {
  addAroma,
  addCardphoto,
  addCardtext,
  addDate,
  addEnvelope,
} from '../../redux/cardEdit/actionCreators'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import { infoButtons } from '../../redux/infoButtons/actionCreators'
import {
  addFullCard,
  choiceMemorySection,
  choiceAddress,
  activeSections,
  addChoiceSection,
  choiceClip,
  sliderLine,
  fullCardPersonalId,
  lockExpendMemoryCard,
  addIndexDb,
} from '../../redux/layout/actionCreators'
import {
  addUserImage,
  getAllHiPostImages,
  getAllUserImages,
  getHiPostImage,
  getUserImage,
  deleteMyAddress,
  deleteToAddress,
  getAllRecordsAddresses,
  deleteRecordAddress,
  getAllRecordCardtext,
  deleteRecordCardtext,
  addUniqueCard,
  getCountCards,
  deleteCard,
  getCardById,
  getAllShopping,
  addUniqueShopping,
  getShoppingById,
  addUniqueBlank,
  getBlankById,
  getAllBlanks,
  deleteHiPostImage,
  deleteUserImage,
} from '../../utils/cardFormNav/indexDB/indexDb'
import MemoryEnvelope from './MemoryEnvelope/MemoryEnvelope'
import MemoryCardtext from './MemoryCardtext/MemoryCardtext'
import { addIconToolbar } from '../../data/toolbar/addIconToolbar'
import { changeIconStyles } from '../../data/toolbar/changeIconStyles'
import MemoryList from './MemoryList/MemoryList'
import SliderCardsList from './SliderCardsList/SliderCardsList'

const CardsList = () => {
  const selectorCardEdit = useSelector((state) => state.cardEdit)
  const selectorLayoutActiveSections = useSelector(
    (state) => state.layout.activeSections
  )
  const selectorLayoutExpendMemoryCard = useSelector(
    (state) => state.layout.expendMemoryCard
  )
  const selectorLayoutLockExpendMemoryCard = useSelector(
    (state) => state.layout.lockExpendMemoryCard
  )
  const selectorLayoutChoiceSave = useSelector(
    (state) => state.layout.choiceSave
  )
  const selectorLayoutChoiceClip = useSelector(
    (state) => state.layout.choiceClip
  )
  const layoutIndexDb = useSelector((state) => state.layout.indexDb)
  const selectorLayoutSizeMiniCard = useSelector(
    (state) => state.layout.sizeMiniCard
  )
  const selectorIBChoiceSection = useSelector(
    (state) => state.layout.choiceSection
  )
  const selectorIBEnvelopeSave = useSelector(
    (state) => state.infoButtons.envelopeSave
  )
  const selectorLayoutMaxCardsList = useSelector(
    (state) => state.layout.maxCardsList
  )
  const [listActiveSections, setListActiveSections] = useState([])
  const [minimize, setMinimize] = useState(null)
  const [expendCardStatus, setExpendCardStatus] = useState(null)
  // const [selectedListCards, setSelectedListCards] = useState(null)
  // const [memoryAddress, setMemoryAddress] = useState({
  //   myaddress: null,
  //   toaddress: null,
  // })
  const [btnsFullCard, setBtnsFullCard] = useState({
    fullCard: { addShopping: true, save: true, remove: true },
  })
  // const [btnsFullCardArrows, setBtnsFullCardArrows] = useState({fullCard: {arrows: true}})
  const [memoryCardtext, setMemoryCardtext] = useState({ cardtext: null })
  const [showIconsMinimize, setShowIconsMinimize] = useState(minimize)
  const memoryRefs = useRef({})
  const btnIconRefs = useRef({})
  const miniPolyCardsRef = useRef()
  const btnArrowsRef = useRef()
  const dispatch = useDispatch()
  const listIconsFullCard = ['addShopping', 'save', 'remove']
  const listSections = ['cardphoto', 'cardtext', 'envelope', 'date', 'aroma']
  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }
  const [infoMinimize, setInfoMinimize] = useState(null)
  const cardsListRef = useRef(null)
  const [widthCardsList, setWidthCardsList] = useState(null)
  const [valueCardsList, setValueCardsList] = useState(0)
  const [infoCardsList, setInfoCardsList] = useState(null)
  const [valueScroll, setValueScroll] = useState(0)
  // const [lockShowIconMinimize, setLockShowIconMinimize] = useState(null)
  // const [personalId, setPersonalId] = useState(null)
  const [fullCard, setFullCard] = useState(null)

  useEffect(() => {
    if (cardsListRef.current) {
      setWidthCardsList(cardsListRef.current.clientWidth)
    }
  }, [])

  useEffect(() => {
    if (infoCardsList && infoCardsList <= selectorLayoutMaxCardsList) {
      dispatch(sliderLine(false))
    }
  }, [infoCardsList])

  const getExpendStatusCard = async (expendCard) => {
    setMinimize(true)
    dispatch(lockExpendMemoryCard(true))
    // dispatch(lockShowIconsMinimize(true))
    let cardExpend
    switch (expendCard.source) {
      case 'shopping':
        const cardExpendShopping = await getShoppingById(Number(expendCard.id))
        cardExpend = cardExpendShopping.shopping
        break
      case 'blanks':
        const cardExpendBlank = await getBlankById(Number(expendCard.id))
        cardExpend = cardExpendBlank.blanks
        break
      default:
        break
    }

    await addUserImage('originalImage', cardExpend.cardphoto)
    await addUserImage('workingImage', cardExpend.cardphoto)
    await addUserImage('miniImage', cardExpend.cardphoto)
    dispatch(addCardtext(cardExpend.cardtext))
    dispatch(addEnvelope(cardExpend.envelope))
    dispatch(addDate(cardExpend.date))
    dispatch(addAroma(cardExpend.aroma))

    dispatch(
      addChoiceSection({
        source: `${expendCard.source}`,
        nameSection: 'cardphoto',
      })
    )
    dispatch(
      activeSections({
        ...selectorLayoutActiveSections,
        cardphoto: Boolean(cardExpend.cardphoto),
        cardtext: Boolean(cardExpend.cardtext),
        envelope: Boolean(cardExpend.envelope),
        date: Boolean(cardExpend.date),
        aroma: Boolean(cardExpend.aroma),
      })
    )
    if (btnArrowsRef.current) {
      choiceClassListContainsFullArrows()
    }
    const timerChangeMinimize = setTimeout(() => {
      setMinimize(false)
    }, 300)
    return () => clearTimeout(timerChangeMinimize)
  }

  useEffect(() => {
    if (
      selectorLayoutExpendMemoryCard?.source &&
      !selectorLayoutLockExpendMemoryCard &&
      ['shopping', 'blanks'].includes(selectorLayoutExpendMemoryCard.source)
    ) {
      getExpendStatusCard(selectorLayoutExpendMemoryCard)
    }
  }, [selectorLayoutExpendMemoryCard, selectorLayoutLockExpendMemoryCard])

  useEffect(() => {
    if (selectorIBChoiceSection.nameSection === 'cardtext') {
      if (selectorLayoutChoiceSave === 'cardtext') {
        getAllCardtext()
      }
    }
  }, [
    selectorIBChoiceSection,
    selectorIBEnvelopeSave,
    selectorLayoutChoiceSave,
    dispatch,
  ])

  const checkForDuplicateCards = async (card) => {
    const sections = ['aroma', 'date', 'envelope', 'cardtext', 'cardphoto']
    const sources = ['shopping', 'blanks']
    const cards = {
      shopping: await getAllShopping(),
      blanks: await getAllBlanks(),
    }
    const resultSources = {
      shopping: {
        aroma: [],
        date: [],
        envelope: [],
        cardtext: [],
        cardphoto: [],
      },
      blanks: {
        aroma: [],
        date: [],
        envelope: [],
        cardtext: [],
        cardphoto: [],
      },
    }

    const resultAroma = (source) => {
      resultSources[source].aroma = cards[source]
        .filter(
          (cardSource) =>
            card.aroma.name === cardSource[source].aroma.name &&
            card.aroma.make === cardSource[source].aroma.make
        )
        .map((cardSource) => cardSource.personalId)
    }

    const resultDate = (source) => {
      resultSources[source].date = cards[source]
        .filter(
          (cardSource) =>
            card.date.day === cardSource[source].date.day &&
            card.date.month === cardSource[source].date.month &&
            card.date.year === cardSource[source].date.year
        )
        .map((cardSource) => cardSource.personalId)
    }

    const resultEnvelope = (source) => {
      const sectionsEnvelope = ['myaddress', 'toaddress']

      for (const cardSource of cards[source]) {
        const resultAddress = sectionsEnvelope.every((sectionEnv) =>
          Object.keys(card.envelope[sectionEnv]).every(
            (inputEnv) =>
              card.envelope[sectionEnv][inputEnv] ===
              cardSource[source].envelope[sectionEnv][inputEnv]
          )
        )

        if (resultAddress) {
          resultSources[source].envelope.push(cardSource.personalId)
        }
      }
    }

    const resultCardtext = (source) => {
      for (const cardSource of cards[source]) {
        if (
          card.cardtext.text.length !== cardSource[source].cardtext.text.length
        ) {
          continue
        }

        const textChildrens = card.cardtext.text.map(
          (text, i) =>
            text.children[0].text ===
            cardSource[source].cardtext.text[i]?.children[0].text
        )

        if (textChildrens.every(Boolean)) {
          resultSources[source].cardtext.push(cardSource.personalId)
        }
      }
    }

    const resultCardphoto = async (source) => {
      const cardData = await getResultCardphoto()
      for (const cardSource of cards[source]) {
        if (cardData.cardphoto.size === cardSource[source].cardphoto.size) {
          resultSources[source].cardphoto.push(cardSource.personalId)
        }
      }
    }

    const callResultSections = {
      aroma: resultAroma,
      date: resultDate,
      envelope: resultEnvelope,
      cardtext: resultCardtext,
      cardphoto: resultCardphoto,
    }

    const result = { shopping: null, blanks: null }

    const checkEverySection = async (source) => {
      for (const section of sections) {
        await callResultSections[section]?.(source)
        if (section === 'aroma') {
          if (resultSources[source][section].length > 0) {
            result[source] = [...resultSources[source][section]]
          } else {
            return
          }
        } else {
          if (result[source]) {
            const coincidences = result[source].filter((id) =>
              resultSources[source][section].includes(id)
            )

            if (coincidences.length > 0) {
              result[source] = [...coincidences]
            } else {
              result[source] = false
            }
          }
        }
      }
    }

    if (selectorCardEdit.aroma && selectorCardEdit.date) {
      for (const source of sources) {
        await checkEverySection(source)
      }
      const updates = {}

      if (btnsFullCard.fullCard.plus !== !result.shopping) {
        updates.addShopping = result.shopping ? false : true
      }
      if (btnsFullCard.fullCard.save !== !result.blanks) {
        updates.save = result.blanks ? false : true
      }

      if (Object.keys(updates).length > 0) {
        setBtnsFullCard((state) => ({
          ...state,
          fullCard: { ...state.fullCard, ...updates },
        }))
      }
      // if (btnIconRefs.current && showIconsMinimize) {
      // }
    }
  }

  useEffect(() => {
    if (btnIconRefs.current && showIconsMinimize) {
      changeIconStyles(btnsFullCard, btnIconRefs.current)
    }
  }, [showIconsMinimize, btnIconRefs, btnsFullCard])

  useEffect(() => {
    if (!selectorLayoutChoiceClip && fullCard) {
      if (btnArrowsRef.current) {
        choiceClassListContainsFullArrows()
      }
      if (miniPolyCardsRef.current) {
        choiceClassListContainsFullPolyCards(true)
      }
    }
  }, [selectorLayoutChoiceClip, fullCard, btnArrowsRef, miniPolyCardsRef])

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

    for (let section in selectorLayoutActiveSections) {
      if (selectorLayoutActiveSections[section]) {
        listSections.push(baseSections[section])
      }
    }

    const sortListSections = listSections.sort(
      (a, b) => a.position - b.position
    )

    setListActiveSections(sortListSections)
  }, [selectorLayoutActiveSections])

  useEffect(() => {
    const isFull = listActiveSections.length === 5

    if (fullCard !== isFull) {
      setFullCard(isFull)
    }

    choiceClassListContainsFullPolyCards(isFull)
  }, [listActiveSections, miniPolyCardsRef, fullCard, btnArrowsRef])

  const choiceClassListContainsFullPolyCards = (state) => {
    switch (state) {
      case true:
        if (miniPolyCardsRef.current.classList.contains('full-fade-out')) {
          miniPolyCardsRef.current.classList.remove('full-fade-out')
        }
        miniPolyCardsRef.current.classList.add('full')
        break

      case false:
        miniPolyCardsRef.current.classList.add('full-fade-out')
        miniPolyCardsRef.current.classList.remove('full')
        break

      default:
        break
    }
  }

  const choiceClassListContainsFullArrows = () => {
    const timer = setTimeout(() => {
      if (!btnArrowsRef.current.classList.contains('full')) {
        btnArrowsRef.current.classList.add('full')
      }
    }, 0)
    return () => clearTimeout(timer)
  }

  const handleClickMiniKebab = async (evt, section, id) => {
    evt.stopPropagation()
    switch (section) {
      case 'cardtext':
        await deleteRecordCardtext(id)
        getAllCardtext()
        break
      case 'aroma':
        dispatch(addAroma(null))
        break

      default:
        break
    }
  }

  const handleClickCardtext = (id) => {
    dispatch(choiceMemorySection({ section: 'cardtext', id }))
  }

  const handleClickIconArrows = () => {
    setMinimize(!minimize)
    checkForDuplicateCards(selectorCardEdit)
    if (selectorIBChoiceSection.source !== 'minimize') {
      dispatch(
        addChoiceSection({
          source: `minimize`,
          nameSection: 'cardphoto',
        })
      )
    }
    setInfoMinimize(infoMinimize || true)
  }

  const getResultCardphoto = async () => {
    const hiPostImages = await getAllHiPostImages()
    const userImages = await getAllUserImages()
    const sectionWorkingImage = hiPostImages.some(
      (el) => el.id === 'workingImage'
    )
      ? 'hiPostImages'
      : userImages.some((el) => el.id === 'workingImage')
      ? 'userImages'
      : null

    let workingImage = null
    const getImages = {
      hiPostImages: getHiPostImage,
      userImages: getUserImage,
    }

    if (sectionWorkingImage) {
      workingImage = await getImages[sectionWorkingImage]('workingImage')
    }

    return listSections.reduce((acc, section) => {
      acc[section] =
        section === 'cardphoto' ? workingImage : selectorCardEdit[section]
      return acc
    }, {})
  }

  const handleClickFullCardIcon = async (evt) => {
    const parentBtn = evt.target.closest('.fullcard-btn')
    if (btnsFullCard.fullCard[parentBtn.dataset.tooltip]) {
      const personalId = uuidv4().split('-')[0]
      dispatch(addFullCard(true))
      const cardData = await getResultCardphoto()

      switch (parentBtn.dataset.tooltip) {
        case 'addShopping':
          await addUniqueShopping(cardData, personalId)
          checkForDuplicateCards(selectorCardEdit)
          dispatch(fullCardPersonalId({ shopping: personalId }))
          break
        case 'save':
          await addUniqueBlank(cardData, personalId)
          checkForDuplicateCards(selectorCardEdit)
          dispatch(fullCardPersonalId({ blanks: personalId }))
          break
        case 'remove':
          dispatch(addAroma(null))
          dispatch(addDate(null))
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
          dispatch(
            addCardtext({
              text: [
                {
                  type: 'paragraph',
                  children: [{ text: '' }],
                },
              ],
              colorName: 'blueribbon',
              colorType: 'rgba(0, 122, 255, 0.8)',
              // font: '',
              // fontSize: 10,
              fontStyle: 'italic',
              fontWeight: 500,
              // textAlign: 'left',
              // lineHeight: null,
              // miniCardtextStyle: {
              //   maxLines: null,
              //   fontSize: null,
              //   lineHeight: null,
              // },
            })
          )
          await deleteHiPostImage('miniImage')
          await deleteUserImage('miniImage')
          dispatch(
            addIndexDb({
              hiPostImages: { miniImage: false },
              userImages: { miniImage: false },
            })
          )
          dispatch(
            activeSections({
              cardphoto: false,
              cardtext: false,
              envelope: false,
              date: false,
              aroma: false,
            })
          )
          setShowIconsMinimize(false)
          setMinimize(false)
          // setBtnsFullCard((state) => ({
          //   ...state,
          //   fullCard: { ...state.fullCard, remove: false },
          // }))
          break

        default:
          break
      }
    }
  }

  // useEffect(() => {
  //   if (btnsFullCard && btnIconRefs.current) {
  //     console.log('btnsFullCard', btnsFullCard, btnIconRefs)
  //     changeIconStyles(btnsFullCard, btnIconRefs.current)
  //   }
  // }, [btnsFullCard, btnIconRefs])

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
    const timerIcon = setTimeout(() => {
      setShowIconsMinimize(minimize)
    }, 700)

    return () => clearTimeout(timerIcon)
  }, [minimize, dispatch])

  const handleChangeFromSliderCardsList = (value) => {
    setValueCardsList(value)
    dispatch(sliderLine(value))
  }

  const choiceMemoryList = () => {
    if (
      selectorLayoutChoiceClip === 'shopping' ||
      selectorLayoutChoiceClip === 'blanks' ||
      selectorLayoutChoiceClip === 'toaddress' ||
      selectorLayoutChoiceClip === 'myaddress'
    ) {
      return (
        <MemoryList
          sizeMiniCard={selectorLayoutSizeMiniCard}
          widthCardsList={widthCardsList}
          setInfoCardsList={setInfoCardsList}
          valueScroll={valueScroll}
          setValueScroll={setValueScroll}
        />
      )
    }
  }

  useEffect(() => {
    const cardsList = cardsListRef.current

    const handleWheel = (evt) => {
      evt.preventDefault()
      if (cardsList) {
        cardsList.scrollLeft += evt.deltaY
        setValueScroll(evt.deltaY)
      }
    }

    const handleTouchMove = (evt) => {
      evt.preventDefault()
    }

    if (cardsList) {
      cardsList.addEventListener('wheel', handleWheel, { passive: false })
      cardsList.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
    }

    return () => {
      if (cardsList) {
        cardsList.removeEventListener('wheel', handleWheel)
        cardsList.removeEventListener('touchmove', handleTouchMove)
      }
    }
  }, [])

  return (
    <div
      className="cards-list"
      ref={cardsListRef}
      // onWheel={handleWheelCardsList}
      // onTouchStart={handleTouchStartCardsList}
      // onTouchMove={handleTouchMoveCardsList}
    >
      <div style={{ height: `${selectorLayoutSizeMiniCard.height}px` }}></div>
      {choiceMemoryList()}
      {!selectorLayoutChoiceClip && selectorLayoutLockExpendMemoryCard && (
        <>
          <div
            className="poly-cards-filter"
            style={{
              width: `${selectorLayoutSizeMiniCard.width}px`,
              height: `${selectorLayoutSizeMiniCard.height}px`,
              boxShadow: minimize
                ? '2px 1px 5px 2px rgba(34, 60, 80, 0.3)'
                : '2px 1px 5px 2px rgba(255, 255, 255, 0.2)',
              transition: 'box-shadow 0.3s',
            }}
          ></div>
          <div
            className="mini-poly-cards"
            ref={miniPolyCardsRef}
            style={{
              width: `${selectorLayoutSizeMiniCard.width}px`,
              height: `${selectorLayoutSizeMiniCard.height}px`,
            }}
          >
            <div className="fullcard-icons-container">
              {fullCard && (
                <button
                  className="fullcard-btn fullcard-btn-arrows"
                  ref={btnArrowsRef}
                  onClick={handleClickIconArrows}
                  // onMouseEnter={handleMouseEnterIconMinimize}
                  // onMouseLeave={handleMouseLeaveIconMinimize}
                >
                  {showIconsMinimize
                    ? addIconToolbar('arrowsOut')
                    : addIconToolbar('arrowsIn')}
                </button>
              )}
              <div className="fullcard-line">
                {minimize &&
                  listIconsFullCard.map((btn, i) => (
                    <button
                      key={`${btn}-${i}`}
                      className="fullcard-btn fullcard-btn-menu"
                      ref={setBtnIconRef(`fullCard-${btn}`)}
                      data-tooltip={btn}
                      onClick={handleClickFullCardIcon}
                    >
                      {addIconToolbar(btn)}
                    </button>
                  ))}
              </div>
            </div>
          </div>
          {listActiveSections.length !== 0 ? (
            listActiveSections
              .filter(
                (selectedSection) =>
                  selectorCardEdit[selectedSection.section] !== null
              )
              .map((selectedSection, i, arr) => (
                <CardMiniSection
                  key={`card-mini-${selectedSection.section}-${i}`}
                  valueSection={selectorCardEdit[selectedSection.section]}
                  sizeCardMini={selectorLayoutSizeMiniCard}
                  infoSection={{
                    section: selectedSection,
                    i,
                    length: arr.length,
                  }}
                  minimize={minimize}
                  infoMinimize={infoMinimize}
                  showIconMinimize={showIconsMinimize}
                />
              ))
          ) : (
            <span></span>
          )}
        </>
      )}
      {infoCardsList &&
        infoCardsList.length > selectorLayoutMaxCardsList &&
        (selectorLayoutChoiceClip === 'shopping' ||
          selectorLayoutChoiceClip === 'blanks' ||
          selectorLayoutChoiceClip === 'toaddress' ||
          selectorLayoutChoiceClip === 'myaddress') && (
          <SliderCardsList
            value={valueCardsList}
            infoCardsList={infoCardsList}
            handleChangeFromSliderCardsList={handleChangeFromSliderCardsList}
            maxCardsList={selectorLayoutMaxCardsList}
          />
        )}
    </div>
  )
}

export default CardsList
