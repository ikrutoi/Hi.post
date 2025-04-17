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
} from '../../utils/cardFormNav/indexDB/indexDb'
import { colorSchemeMain } from '../../data/main/colorSchemeMain'
import { colorScheme } from '../../data/toolbar/colorScheme'
import MemoryEnvelope from './MemoryEnvelope/MemoryEnvelope'
import MemoryCardtext from './MemoryCardtext/MemoryCardtext'
import { addIconToolbar } from '../../data/toolbar/addIconToolbar'
import { changeIconStyles } from '../../data/toolbar/changeIconStyles'
import MemoryList from './MemoryList/MemoryList'
import SliderCardsList from './SliderCardsList/SliderCardsList'

const CardsList = () => {
  // const layoutFullCard = useSelector((state) => state.layout.fullCard)
  const cardEdit = useSelector((state) => state.cardEdit)
  const layoutActiveSections = useSelector(
    (state) => state.layout.activeSections
  )
  const infoExpendMemoryCard = useSelector(
    (state) => state.layout.expendMemoryCard
  )
  const infoChoiceSave = useSelector((state) => state.layout.choiceSave)
  const infoChoiceClip = useSelector((state) => state.layout.choiceClip)
  const layoutIndexDb = useSelector((state) => state.layout.indexDb)
  const infoActiveSections = useSelector((state) => state.layout.activeSections)
  const sizeMiniCard = useSelector((state) => state.layout.sizeMiniCard)
  const infoChoiceSection = useSelector((state) => state.layout.choiceSection)
  const infoEnvelopeSave = useSelector(
    (state) => state.infoButtons.envelopeSave
  )
  const [listActiveSections, setListActiveSections] = useState([])
  const [minimize, setMinimize] = useState(null)
  const [stylePolyCards, setStylePolyCards] = useState({
    iconArrows: {},
    iconPlus: {},
  })
  const [expendCardStatus, setExpendCardStatus] = useState(null)
  // const [selectedListCards, setSelectedListCards] = useState(null)
  // const [memoryAddress, setMemoryAddress] = useState({
  //   myaddress: null,
  //   toaddress: null,
  // })
  const [btnsFullCard, setBtnsFullCard] = useState({
    fullCard: { plus: true, save: true, remove: true },
  })
  const [memoryCardtext, setMemoryCardtext] = useState({ cardtext: null })
  const [showIconMinimize, setShowIconMinimize] = useState(minimize)
  const memoryRefs = useRef({})
  const btnIconRefs = useRef({})
  const miniPolyCardsRef = useRef()
  const dispatch = useDispatch()
  const listIconsFullCard = ['plus', 'save', 'remove']
  const listSections = ['cardphoto', 'cardtext', 'envelope', 'date', 'aroma']
  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }
  // const [duplicateCards, setDuplicateCards] = useState(null)
  const [infoMinimize, setInfoMinimize] = useState(null)
  const cardsListRef = useRef(null)
  const [widthCardsList, setWidthCardsList] = useState(null)
  const [valueCardsList, setValueCardsList] = useState(0)
  const [infoCardsList, setInfoCardsList] = useState(null)
  const [valueScroll, setValueScroll] = useState(0)
  // const [personalId, setPersonalId] = useState(null)
  const maxCardsList = useSelector((state) => state.layout.maxCardsList)

  useEffect(() => {
    if (cardsListRef.current) {
      setWidthCardsList(cardsListRef.current.clientWidth)
    }
  }, [])

  useEffect(() => {
    if (infoCardsList && infoCardsList <= maxCardsList) {
      dispatch(sliderLine(false))
    }
  }, [infoCardsList])

  const getExpendStatusCard = async (expendCard) => {
    setMinimize(true)
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
        ...layoutActiveSections,
        cardphoto: Boolean(cardExpend.cardphoto),
        cardtext: Boolean(cardExpend.cardtext),
        envelope: Boolean(cardExpend.envelope),
        date: Boolean(cardExpend.date),
        aroma: Boolean(cardExpend.aroma),
      })
    )
    const timerChangeMinimize = setTimeout(() => {
      setMinimize(false)
    }, 300)

    return () => clearTimeout(timerChangeMinimize)
  }

  const choiceStyleMiniPolyCards = (state) => {
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

        // const fadeOutTimer = setTimeout(() => {
        //   miniPolyCardsRef.current.classList.remove('full-fade-out')
        // }, 500)

        // clearTimeout(fadeOutTimer)
        break

      default:
        break
    }
  }

  useEffect(() => {
    if (
      infoExpendMemoryCard !== false &&
      (infoExpendMemoryCard.source === 'shopping' ||
        infoExpendMemoryCard.source === 'blanks')
    ) {
      getExpendStatusCard(infoExpendMemoryCard)
    }
  }, [infoExpendMemoryCard])

  useEffect(() => {
    // if (infoChoiceSection.nameSection === 'envelope') {
    //   if (infoEnvelopeSave) {
    //     getAllAddress(infoEnvelopeSave)
    //     dispatch(infoButtons({ envelopeSave: false }))
    //   }
    // }
    if (infoChoiceSection.nameSection === 'cardtext') {
      if (infoChoiceSave === 'cardtext') {
        getAllCardtext()
        // setSelectedListCards('cardtext')
      }
    }
  }, [infoChoiceSection, infoEnvelopeSave, infoChoiceSave, dispatch])

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
      for (const cardSource of cards[source]) {
        if (
          card.aroma.name === cardSource[source].aroma.name &&
          card.aroma.make === cardSource[source].aroma.make
        ) {
          resultSources[source].aroma.push(cardSource.personalId)
        }
      }
    }

    const resultDate = (source) => {
      for (const cardSource of cards[source]) {
        if (
          card.date.day === cardSource[source].date.day &&
          card.date.month === cardSource[source].date.month &&
          card.date.year === cardSource[source].date.year
        ) {
          resultSources[source].date.push(cardSource.personalId)
        }
      }
    }

    const resultEnvelope = (source) => {
      const sectionsEnvelope = ['myaddress', 'toaddress']
      const inputsEnvelope = {
        myaddress: Object.keys(card.envelope.myaddress),
        toaddress: Object.keys(card.envelope.toaddress),
      }
      const inputsSection = { myaddress: [], toaddress: [] }
      const resultAddress = { myaddress: null, toaddress: null }
      for (const cardSource of cards[source]) {
        for (const sectionEnv of sectionsEnvelope) {
          for (const inputEnv of inputsEnvelope[sectionEnv]) {
            if (
              card.envelope[sectionEnv][inputEnv] ===
              cardSource[source].envelope[sectionEnv][inputEnv]
            ) {
              inputsSection[sectionEnv].push(true)
            } else {
              inputsSection[sectionEnv].push(false)
            }
          }
          resultAddress[sectionEnv] = inputsSection[sectionEnv].every(
            (input) => input === true
          )
          inputsSection[sectionEnv] = []
        }
        if (resultAddress.myaddress && resultAddress.toaddress) {
          resultSources[source].envelope.push(cardSource.personalId)
        }
      }
    }

    const resultCardtext = (source) => {
      const textChildrens = []
      for (const cardSource of cards[source]) {
        if (
          card.cardtext.text.length === cardSource[source].cardtext.text.length
        ) {
          card.cardtext.text.forEach((text, i) => {
            if (
              text.children[0].text ===
              cardSource[source].cardtext.text[i].children[0].text
            ) {
              textChildrens.push(true)
            } else {
              textChildrens.push(false)
            }
          })
          if (textChildrens.every((text) => text === true)) {
            resultSources[source].cardtext.push(cardSource.personalId)
          }
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
        console.log('+', section)
        console.log('result', result)
        await callResultSections[section]?.(source)
        if (section === 'aroma') {
          if (resultSources[source][section].length > 0) {
            result[source] = [...resultSources[source][section]]
          } else {
            console.log('+aroma return')
            return
          }
        } else {
          const coincidences = result[source].filter((id) =>
            resultSources[source][section].includes(id)
          )

          console.log('coin', source, section, coincidences)

          if (coincidences.length > 0) {
            result[source] = [...coincidences]
          } else {
            result[source] = false
            return
          }
        }
        console.log('++', section)
      }
      console.log('result', result)
      setBtnsFullCard((state) => {
        return {
          ...state,
          fullCard: {
            ...state.fullCard,
            plus: result.shopping ? false : true,
            save: result.blanks ? false : true,
          },
        }
      })
    }

    if (cardEdit.aroma && cardEdit.date) {
      for (const source of sources) {
        checkEverySection(source)
      }
    }
  }

  useEffect(() => {
    if (minimize) {
      console.log('check..')
      checkForDuplicateCards(cardEdit)
    }
  }, [minimize])

  useEffect(() => {
    // setSelectedListCards(infoChoiceClip)
    switch (infoChoiceClip) {
      // case 'myaddress':
      //   getAllAddress('myaddress')
      //   break
      // case 'toaddress':
      //   getAllAddress('toaddress')
      //   break
      case 'cardtext':
        getAllCardtext()
        break
      // case 'shopping':
      //   getAllCardsShopping()
      //   break
      // case 'blanks':
      //   getAllBlanks()
      //   break

      default:
        break
    }
  }, [infoChoiceClip])

  // const getAllBlanks = async () => {}

  // const getAllAddress = async (section) => {
  //   const listAddress = await getAllRecordsAddresses(
  //     section === 'myaddress' ? 'myAddress' : 'toAddress'
  //   )
  //   setMemoryAddress((state) => {
  //     return {
  //       ...state,
  //       [section]: listAddress,
  //     }
  //   })
  //   setSelectedListCards(section)
  // }

  const getAllCardtext = async () => {
    const listCardtexts = await getAllRecordCardtext()
    setMemoryCardtext((state) => {
      return {
        ...state,
        cardtext: listCardtexts,
      }
    })
    // setSelectedListCards('cardtext')
  }

  // const getAllCardsShopping = async () => {
  //   const listShopping = await getAllShopping()
  // }

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

  const changeStyleFullCardIcons = (style) => {
    switch (style) {
      case 'backgroundColor':
        if (minimize) {
          if (showIconMinimize) {
            return 'rgba(240, 240, 240, 0.75)'
          }
          return 'rgba(240, 240, 240, 0)'
        } else {
          return 'rgba(240, 240, 240, 0)'
        }
      case 'color':
        if (minimize) {
          if (showIconMinimize) {
            return 'rgba(71, 71, 71, 1)'
          }
          return 'rgba(71, 71, 71, 0)'
        } else {
          return 'rgba(71, 71, 71, 0)'
        }

      default:
        break
    }
  }

  useEffect(() => {
    if (listActiveSections.length === 5) {
      setStylePolyCards((state) => {
        return {
          iconArrows: {
            ...state.iconArrows,
            backgroundColor: 'rgba(240, 240, 240, 0.75)',
            // backgroundColor: 'rgba(0, 125, 215, 0.85)',
            color: colorSchemeMain.gray,
            // color: colorSchemeMain.lightGray,
            cursor: 'pointer',
          },
          iconPlus: {
            ...state.iconPlus,
            backgroundColor: changeStyleFullCardIcons('backgroundColor'),
            color: changeStyleFullCardIcons('color'),
            cursor: minimize && showIconMinimize ? 'pointer' : 'default',
          },
        }
      })
      if (miniPolyCardsRef.current) {
        choiceStyleMiniPolyCards(true)
      }
    } else {
      if (infoMinimize) {
        setInfoMinimize(false)
        // changeStyleFullCardIcons(false)
      }
      setStylePolyCards((state) => {
        return {
          ...state,
          iconArrows: {
            ...state.iconArrows,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            color: 'rgba(255, 255, 255, 0)',
            cursor: 'default',
          },
          iconPlus: {
            ...state.iconPlus,
            backgroundColor: 'rgba(240, 240, 240, 0)',
            // color: 'rgba(71, 71, 71, 0)',
            cursor: 'default',
          },
        }
      })
      if (miniPolyCardsRef.current) {
        choiceStyleMiniPolyCards(false)
      }
    }
  }, [listActiveSections, showIconMinimize, minimize, miniPolyCardsRef])

  // useEffect(() => {
  //   // if ()
  //   setBtnsFullCard((state) => {
  //     return {
  //       ...state,
  //       fullCard: {
  //         ...state.fullCard,
  //         plus: result.shopping ? false : true,
  //         save: result.blanks ? false : true,
  //       },
  //     }
  //   })
  // }, [minimize, showIconMinimize])

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
      // case 'myaddress':
      //   await deleteRecordAddress('myAddress', id)
      //   getAllAddress(section)
      //   break
      // case 'toaddress':
      //   await deleteRecordAddress('toAddress', id)
      //   getAllAddress(section)
      //   break
      case 'aroma':
        dispatch(addAroma(null))
        break

      default:
        break
    }
  }

  // const handleClickAddress = (section, id) => {
  //   dispatch(choiceAddress({ section, id }))
  // }

  const handleClickCardtext = (id) => {
    dispatch(choiceMemorySection({ section: 'cardtext', id }))
  }

  const handleClickIconMinimize = () => {
    if (listActiveSections.length === 5) {
      minimize ? setMinimize(false) : setMinimize(true)
      // dispatch(choiceClip(minimize ? 'minimize' : false))
      if (infoChoiceSection.source !== 'minimize') {
        dispatch(
          addChoiceSection({
            source: `minimize`,
            nameSection: 'cardphoto',
          })
        )
      }
      // dispatch(
      //   addChoiceSection({
      //     source: minimize ? 'minimize' : null,
      //     nameSection: minimize ? 'cardphoto' : null,
      //   })
      // )
      if (!infoMinimize) {
        setInfoMinimize(true)
      }
    }
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
      acc[section] = section === 'cardphoto' ? workingImage : cardEdit[section]
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
        case 'plus':
          await addUniqueShopping(cardData, personalId)
          dispatch(fullCardPersonalId({ shopping: personalId }))
          break
        case 'save':
          await addUniqueBlank(cardData, personalId)
          dispatch(fullCardPersonalId({ blanks: personalId }))
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
    // dispatch(fullCard(minimize))
    const timerIcon = setTimeout(() => {
      setShowIconMinimize(minimize)
    }, 800)

    return () => clearTimeout(timerIcon)
  }, [minimize])

  const handleChangeFromSliderCardsList = (value) => {
    setValueCardsList(value)
    dispatch(sliderLine(value))
  }

  const choiceMemoryList = () => {
    // if (selectedListCards === 'myaddress') {
    //   return (
    //     <MemoryEnvelope
    //       // key={`${selectedListCards}-${i}`}
    //       // setRef={setRef}
    //       sizeMiniCard={sizeMiniCard}
    //       // section={selectedListCards}
    //       // address={address}
    //       // handleClickMiniKebab={handleClickMiniKebab}
    //       // handleClickAddress={handleClickAddress}
    //     />
    //     // <div className="memory-list">
    //     //   {memoryAddress[selectedListCards] &&
    //     //     memoryAddress[selectedListCards].map((address, i) => (
    //     //     ))}
    //     // </div>
    //   )
    // }
    if (infoChoiceClip === 'cardtext') {
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
    if (
      infoChoiceClip === 'shopping' ||
      infoChoiceClip === 'blanks' ||
      infoChoiceClip === 'toaddress' ||
      infoChoiceClip === 'myaddress'
    ) {
      return (
        <MemoryList
          sizeMiniCard={sizeMiniCard}
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
      <div style={{ height: `${sizeMiniCard.height}px` }}></div>
      {choiceMemoryList()}
      {!infoChoiceClip && (
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
            ref={miniPolyCardsRef}
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
                    transition: 'background-color 0.3s ease, color 0.3s ease',
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
                {listIconsFullCard.map((btn, i) => {
                  return (
                    <button
                      key={`${btn}-${i}`}
                      className="fullcard-btn"
                      ref={setBtnIconRef(`fullCard-${btn}`)}
                      data-tooltip={btn}
                      style={{
                        color: btnsFullCard.fullCard[btn]
                          ? colorScheme.true
                          : colorScheme.false,
                        backgroundColor:
                          stylePolyCards.iconPlus.backgroundColor,
                        cursor: btnsFullCard.fullCard[btn]
                          ? 'pointer'
                          : 'default',
                        transition: 'background-color 0.3s ease',
                      }}
                      onClick={handleClickFullCardIcon}
                    >
                      {showIconMinimize ? addIconToolbar(btn) : <></>}
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
                  infoMinimize={infoMinimize}
                  showIconMinimize={showIconMinimize}
                />
              ))
          ) : (
            <span></span>
          )}
        </>
      )}
      {infoCardsList &&
        infoCardsList.length > maxCardsList &&
        (infoChoiceClip === 'shopping' ||
          infoChoiceClip === 'blanks' ||
          infoChoiceClip === 'toaddress' ||
          infoChoiceClip === 'myaddress') && (
          <SliderCardsList
            value={valueCardsList}
            infoCardsList={infoCardsList}
            handleChangeFromSliderCardsList={handleChangeFromSliderCardsList}
            maxCardsList={maxCardsList}
          />
        )}
    </div>
  )
}

export default CardsList
