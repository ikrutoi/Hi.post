import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import './Envelope.scss'
import listLabelsMyAddress from '../../../../data/envelope/list-labels-my-address.json'
import listLabelsToAddress from '../../../../data/envelope/list-labels-to-address.json'
import { addEnvelope } from '../../../../store/slices/cardEditSlice'
import Mark from './Mark/Mark'
import FormAddress from './FormAddress/FormAddress'
import {
  // choiceAddress,
  setDeleteSection,
  setChoiceClip,
  setActiveSections,
  setFullCardPersonalId,
  setExpendMemoryCard,
} from '../../../../store/slices/layoutSlice'
import {
  getAllRecordsAddresses,
  getCountRecordsAddresses,
  getRecordAddressById,
  addRecordAddress,
  addUniqueRecordAddress,
  deleteRecordAddress,
} from '../../../../utils/cardFormNav/indexDB/indexDb'
import { dbPromise } from '../../../../utils/cardFormNav/indexDB/indexDb'
import { updateButtonsState } from '../../../../store/slices/infoButtonsSlice'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '../../../../data/toolbar/handleMouse'
import { colorScheme } from '../../../../data/toolbar/colorScheme'
import { changeIconStyles } from '../../../../data/toolbar/changeIconStyles'
import ToolbarEnvelope from './ToolbarEnvelope/ToolbarEnvelope'

const Envelope = ({ cardPuzzleRef }) => {
  const fullCard = useSelector((state) => state.layout.fullCard)
  const cardEditEnvelope = useSelector((state) => state.cardEdit.envelope)
  const layoutDeleteSection = useSelector(
    (state) => state.layout.setDeleteSection
  )
  const layoutChoiceClip = useSelector((state) => state.layout.setChoiceClip)
  const layoutActiveSections = useSelector(
    (state) => state.layout.setActiveSections
  )
  const infoMiniAddressClose = useSelector(
    (state) => state.infoButtons.miniAddressClose
  )
  // const layoutChoiceAddress = useSelector((state) => state.layout.choiceAddress)
  const [value, setValue] = useState(cardEditEnvelope)
  const [memoryAddress, setMemoryAddress] = useState({
    myaddress: null,
    toaddress: null,
  })
  const [btnsAddress, setBtnsAddress] = useState({
    myaddress: { save: false, delete: false, clip: false },
    toaddress: { save: false, delete: false, clip: false },
  })
  const [countAddress, setCountAddress] = useState({
    myaddress: null,
    toaddress: null,
  })
  const [stateMouseClip, setStateMouseClip] = useState(null)
  const inputRefs = useRef({})
  const btnIconRefs = useRef({})
  const addressFormRefs = useRef({})
  const envelopeLogoRef = useRef(null)
  const layoutActiveEnvelope = useSelector(
    (state) => state.layout.setActiveSections.envelope
  )
  const infoExpendsMemoryCard = useSelector(
    (state) => state.layout.setExpendMemoryCard
  )
  const dispatch = useDispatch()

  const setInputRef = (id) => (element) => {
    inputRefs.current[id] = element
  }

  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }

  const setAddressFormRef = (id) => (element) => {
    addressFormRefs.current[id] = element
  }

  useEffect(() => {
    if (layoutDeleteSection === 'envelope') {
      clearSectionAddress('myaddress')
      clearSectionAddress('toaddress')
      dispatch(setDeleteSection(null))
    }
  }, [layoutDeleteSection, dispatch])

  useEffect(() => {
    const fetchAddress = async () => {
      const addressById = await getRecordAddressById(
        infoExpendsMemoryCard.source,
        Number(infoExpendsMemoryCard.id)
      )

      if (addressById && addressById.address) {
        setValue((state) => {
          return {
            ...state,
            [infoExpendsMemoryCard.source]: {
              ...state[infoExpendsMemoryCard.source],
              ...addressById.address,
            },
          }
        })
        dispatch(setExpendMemoryCard(false))
      }
    }

    if (
      infoExpendsMemoryCard &&
      (infoExpendsMemoryCard.source === 'myaddress' ||
        infoExpendsMemoryCard.source === 'toaddress')
    ) {
      fetchAddress()
    }
  }, [infoExpendsMemoryCard, dispatch])

  // useEffect(() => {
  //   const fetchAddress = async () => {
  //     const address = await getRecordAddressById(
  //       layoutChoiceAddress.section === 'myaddress' ? 'myaddress' : 'toaddress',
  //       layoutChoiceAddress.id
  //     )

  //     setValue((state) => {
  //       return {
  //         ...state,
  //         [layoutChoiceAddress.section]: {
  //           ...state[layoutChoiceAddress.section],
  //           ...address.address,
  //         },
  //       }
  //     })
  //     dispatch(choiceAddress({ section: null, id: null }))
  //   }

  //   if (layoutChoiceAddress.section && layoutChoiceAddress.id) {
  //     fetchAddress()
  //   }
  // }, [layoutChoiceAddress, dispatch])

  useEffect(() => {
    const checkField = (section) => {
      const fullAddress = Object.values(value[section]).every(
        (value) => value !== ''
      )
      const notEmptyAddress = Object.values(value[section]).some(
        (value) => value !== ''
      )
      setBtnsAddress((state) => {
        return {
          ...state,
          [section]: { ...state[section], delete: notEmptyAddress },
        }
      })

      if (section === 'toaddress') {
        dispatch(
          setActiveSections({ ...layoutActiveSections, envelope: fullAddress })
        )
      }

      if (fullAddress) {
        const parityToaddress = changeParityInputsAddress(section)
        setBtnsAddress((state) => {
          return {
            ...state,
            [section]: { ...state[section], save: parityToaddress },
          }
        })
      } else {
        setBtnsAddress((state) => {
          return {
            ...state,
            [section]: { ...state[section], save: false },
          }
        })
      }
    }

    const getCountAddress = async (section) => {
      const BooleanCountAddress = Boolean(
        await getCountRecordsAddresses(
          section === 'myaddress' ? 'myaddress' : 'toaddress'
        )
      )

      if (BooleanCountAddress) {
        const listAddresses = await getAllRecordsAddresses(
          section === 'myaddress' ? 'myaddress' : 'toaddress'
        )
        setMemoryAddress((state) => {
          return {
            ...state,
            [section]: listAddresses,
          }
        })
      }

      setBtnsAddress((state) => {
        return {
          ...state,
          [section]: { ...state[section], clip: BooleanCountAddress },
        }
      })
    }

    const processSections = async (value) => {
      for (const section of Object.keys(value)) {
        checkField(section)
        await getCountAddress(section)
      }
    }

    processSections(value)
  }, [value, dispatch])

  useEffect(() => {
    if (infoMiniAddressClose) {
      const fullToAddress = Object.values(value[infoMiniAddressClose]).every(
        (value) => value !== ''
      )
      if (fullToAddress) {
        setBtnsAddress((state) => {
          return {
            ...state,
            [infoMiniAddressClose]: {
              ...state[infoMiniAddressClose],
              save: true,
            },
          }
        })
      }
    }
    dispatch(updateButtonsState({ miniAddressClose: false }))
  }, [infoMiniAddressClose, dispatch])

  const handleValue = (field, input, value) => {
    setValue((state) => {
      return { ...state, [field]: { ...state[field], [input]: value } }
    })
  }

  useEffect(() => {
    if (btnsAddress && btnIconRefs.current) {
      changeIconStyles(btnsAddress, btnIconRefs.current)
      // Object.keys(btnsAddress).forEach((section) => {
      //   Object.keys(btnsAddress[section]).forEach((btn) => {
      //     const stateBtn = btnsAddress[section][btn]
      //     btnIconRefs.current[`${section}-${btn}`].style.color =
      //       colorScheme[stateBtn]
      //     btnIconRefs.current[`${section}-${btn}`].style.cursor = 'default'
      //   })
      // })
    }
  }, [btnsAddress, btnIconRefs])

  const [heightLogo, setHeightLogo] = useState(null)

  useEffect(() => {
    if (cardPuzzleRef) {
      setHeightLogo(cardPuzzleRef.clientHeight / 14)
    }
  }, [cardPuzzleRef])

  useEffect(() => {
    dispatch(addEnvelope(value))
    // setChoiceSection('envelope')
  }, [dispatch, value])

  const handleMovingBetweenInputs = (evt) => {
    const indexInput = Number(evt.target.dataset.index)
    const field = evt.target.dataset.field
    if (evt.key === 'ArrowDown' || evt.key === 'Enter') {
      if (indexInput < 5) {
        inputRefs.current[`${field}${indexInput + 1}`].focus()
      } else {
        inputRefs.current[`${field}${indexInput}`].focus()
      }
    }
    if (evt.key === 'ArrowUp') {
      if (indexInput > 1) {
        inputRefs.current[`${field}${indexInput - 1}`].focus()
      } else {
        inputRefs.current[`${field}${indexInput}`].focus()
      }
    }
  }

  const searchParentBtnNav = (el) => {
    if (el.classList.contains('toolbar-btn')) {
      return el
    } else if (el.parentElement) {
      return searchParentBtnNav(el.parentElement)
    }
    return null
  }

  const getCountAddress = async (section) => {
    const countAddress = await getCountRecordsAddresses(section)
    return countAddress
  }

  useEffect(() => {
    const sectionsForm = ['myaddress', 'toaddress']
    const changeStyleForm = (section, state) => {
      if (addressFormRefs.current[`${section}-fieldset`]) {
        addressFormRefs.current[`${section}-fieldset`].style.borderColor =
          colorScheme[state]
        addressFormRefs.current[`${section}-legend`].style.color =
          colorScheme[state]
      }
    }

    const fetchAndSetData = async () => {
      if (layoutChoiceClip) {
        for (const section of sectionsForm) {
          if (section === layoutChoiceClip) {
            changeStyleForm(section, 'hover')
            setBtnsAddress((state) => ({
              ...state,
              [section]: { ...state[section], clip: 'hover' },
            }))
          } else {
            changeStyleForm(section, 'false')
            const count = await getCountAddress(section)
            setBtnsAddress((state) => ({
              ...state,
              [section]: {
                ...state[section],
                clip: count ? true : false,
              },
            }))
          }
        }
      }
    }

    fetchAndSetData()
  }, [layoutChoiceClip, stateMouseClip])

  const resetBtnClip = async () => {
    const sectionsForm = ['myaddress', 'toaddress']
    for (const section of sectionsForm) {
      const count = await getCountAddress(section)
      setBtnsAddress((state) => ({
        ...state,
        [section]: {
          ...state[section],
          clip: count ? true : false,
        },
      }))
    }
  }

  useEffect(() => {
    if (!layoutChoiceClip) {
      resetBtnClip()
    }
  }, [layoutChoiceClip])

  const handleClickClip = (section) => {
    if (layoutChoiceClip) {
      if (layoutChoiceClip === section) {
        dispatch(setChoiceClip(false))
      } else {
        dispatch(setChoiceClip(section))
      }
    } else {
      dispatch(setChoiceClip(section))
    }
  }

  const changeParityInputsAddress = (section) => {
    const memorySection = memoryAddress[section]
    const currentSection = value[section]

    if (!memorySection) {
      return true
    }

    return !memorySection.some((el) => {
      const arrInputs = Object.keys(el.address).map((key) => {
        return el.address[key] === currentSection[key]
      })

      return arrInputs.every((value) => value === true)
    })
  }

  const clearSectionAddress = (section) => {
    setValue((state) => {
      return {
        ...state,
        [section]: Object.keys(state[section]).reduce((acc, key) => {
          acc[key] = ''
          return acc
        }, {}),
      }
    })
  }

  const handleClickBtn = async (evt, section) => {
    evt.preventDefault()

    const clearAddress = async (section) => {
      const db = await dbPromise
      const transaction = db.transaction(section, 'readwrite')
      const objectStore = transaction.objectStore(section)
      const clearRequest = objectStore.clear()

      clearRequest.onsuccess = () => {
        console.log('All entries have been cleared.')
      }

      clearRequest.onerror = (event) => {
        console.error('Error clearing entries:', event.target.error)
      }
    }

    const parentBtn = searchParentBtnNav(evt.target, section)
    if (parentBtn.dataset.tooltip === 'clip') {
      if (btnsAddress[section].clip) {
        handleClickClip(section)
      }
    }

    if (parentBtn.dataset.tooltip === 'save') {
      const personalId = uuidv4().split('-')[0]
      if (btnsAddress[section].save) {
        const arrName = value[section].name.split(' ')
        const nameNoEmpty = arrName.filter((word) => word !== '').join(' ')
        const arrCountry = value[section].country.split(' ')
        const countryNoEmpty = arrCountry
          .filter((word) => word !== '')
          .join(' ')
        const arrCity = value[section].city.split(' ')
        const cityNoEmpty = arrCity.filter((word) => word !== '').join(' ')
        setValue((state) => {
          return {
            ...state,
            [section]: {
              ...state[section],
              name: nameNoEmpty,
              country: countryNoEmpty,
              city: cityNoEmpty,
            },
          }
        })
        await addUniqueRecordAddress(section, value[section], personalId)
        setBtnsAddress((state) => {
          return {
            ...state,
            [section]: { ...state[section], save: false },
          }
        })
        dispatch(updateButtonsState({ envelopeSave: section }))
        dispatch(setChoiceClip(section))
        dispatch(setFullCardPersonalId(personalId))
      }
    }
    if (parentBtn.dataset.tooltip === 'delete') {
      clearSectionAddress(section)
    }
  }

  const handleMouseEnter = (evt) => {
    // setStateMouseClip(true)
    handleMouseEnterBtn(evt, btnsAddress)
  }

  const handleMouseLeave = (evt) => {
    // setStateMouseClip(false)
    handleMouseLeaveBtn(evt, btnsAddress)
  }

  return (
    <div className="envelope">
      <div
        className="nav-container nav-container-envelope"
        style={{
          borderColor: layoutActiveEnvelope
            ? 'rgb(255, 255, 255)'
            : 'rgb(220, 220, 220)',
          transition: 'border-color 0.3s ease 0.3s',
        }}
      >
        <ToolbarEnvelope />
      </div>
      <div className="envelope-myaddress">
        <div className="envelope-logo-container">
          <span
            className="envelope-logo"
            ref={envelopeLogoRef}
            style={{ height: heightLogo ? heightLogo : 0 }}
          ></span>
        </div>
        <FormAddress
          values={value}
          listLabelsAddress={{ list: listLabelsMyAddress, name: 'myaddress' }}
          handleValue={handleValue}
          handleMovingBetweenInputs={handleMovingBetweenInputs}
          setInputRef={setInputRef}
          setBtnIconRef={setBtnIconRef}
          setAddressFormRef={setAddressFormRef}
          handleClickBtn={handleClickBtn}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      </div>
      <Mark />
      <div className="envelope-toaddress">
        <FormAddress
          values={value}
          listLabelsAddress={{ list: listLabelsToAddress, name: 'toaddress' }}
          handleValue={handleValue}
          handleMovingBetweenInputs={handleMovingBetweenInputs}
          setInputRef={setInputRef}
          setBtnIconRef={setBtnIconRef}
          setAddressFormRef={setAddressFormRef}
          handleClickBtn={handleClickBtn}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          // handleMouseEnter={(evt) => handleMouseEnter(evt, btnsAddress)}
          // handleMouseLeave={(evt) => handleMouseLeave(evt, btnsAddress)}
        />
      </div>
    </div>
  )
}

export default Envelope
