import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import listLabelsMyAddress from '../../../../data/envelope/list-labels-my-address.json'
import listLabelsToAddress from '../../../../data/envelope/list-labels-to-address.json'
import './Envelope.scss'
import { addEnvelope } from '../../../../redux/cardEdit/actionCreators'
import Mark from './Mark/Mark'
import FormAddress from './FormAddress/FormAddress'
import {
  addMyAddress,
  getMyAddress,
  deleteMyAddress,
  getAllMyAddress,
  addToAddress,
  getToAddress,
  deleteToAddress,
  getAllToAddress,
  getAllRecordsAddresses,
  getRecordAddressById,
  addRecordAddress,
  addUniqueRecordAddress,
  deleteRecordAddress,
} from '../../../../utils/cardFormNav/indexDB/indexDb'
import { addChoiceSection } from '../../../../redux/layout/actionCreators'
import {
  addIndexMyAddress,
  addIndexToAddress,
} from '../../../../redux/layout/actionCreators'
import { dbPromise } from '../../../../utils/cardFormNav/indexDB/indexDb'
import { infoButtons } from '../../../../redux/infoButtons/actionCreators'

const Envelope = ({ cardPuzzleRef, setChoiceSection }) => {
  const selectorCardEdit = useSelector((state) => state.cardEdit)
  const myAddress = useSelector((state) => state.cardEdit.envelope.myaddress)
  const toAddress = useSelector((state) => state.cardEdit.envelope.toaddress)
  const indexMyAddress = useSelector((state) => state.layout.indexMyAddress)
  const indexToAddress = useSelector((state) => state.layout.indexToAddress)
  const infoEnvelopeClipMyAddress = useSelector(
    (state) => state.infoButtons.envelopeClipMyAddress
  )
  const infoEnvelopeClipToAddress = useSelector(
    (state) => state.infoButtons.envelopeClipToAddress
  )
  const valueEnvelope =
    selectorCardEdit.envelope.myaddress === null &&
    selectorCardEdit.envelope.toaddress === null
      ? {
          toaddress: { street: '', index: '', city: '', country: '', name: '' },
          myaddress: { street: '', index: '', city: '', country: '', name: '' },
        }
      : selectorCardEdit.envelope

  const [value, setValue] = useState(valueEnvelope)
  const myAddressLegendRef = useRef()
  const toAddressLegendRef = useRef()
  const myAddressFieldsetRef = useRef()
  const toAddressFieldsetRef = useRef()
  const [memoryMyAddress, setMemoryMyAddress] = useState(null)
  const [memoryToAddress, setMemoryToAddress] = useState(null)
  const [saveMyAddress, setSaveMyAddress] = useState(null)
  const [clipMyAddress, setClipMyAddress] = useState(null)
  const [deleteMyAddress, setDeleteMyAddress] = useState(null)
  const [saveToAddress, setSaveToAddress] = useState(null)
  const [clipToAddress, setClipToAddress] = useState(null)
  const [deleteToAddress, setDeleteToAddress] = useState(null)
  const inputRefs = useRef({})
  const iconRefs = useRef({})

  console.log('saveMyAddress', saveMyAddress)

  const resultMyAddress = !Object.values(myAddress).some(
    (value) => value === ''
  )
  const resultToAddress = !Object.values(toAddress).some(
    (value) => value === ''
  )
  const envelopeLogoRef = useRef(null)

  const dispatch = useDispatch()

  const getAllAddress = async () => {
    const myAddress = await getAllMyAddress('myAddress')
    setMemoryMyAddress(myAddress)
    const toAddress = await getAllToAddress('toAddress')
    setMemoryToAddress(toAddress)
  }

  const setInputRef = (id) => (element) => {
    inputRefs.current[id] = element
  }

  const setIconRef = (id) => (element) => {
    iconRefs.current[id] = element
  }

  useEffect(() => {
    getAllAddress()
  }, [])

  const handleValue = (field, input, value) => {
    if (field === 'myaddress') {
      const resultMyAddress = !Object.values(myAddress).some(
        (value) => value === ''
      )
      if (resultMyAddress) {
        setSaveMyAddress(true)
      } else {
        setSaveMyAddress(false)
      }
    }
    if (field === 'toaddress') {
      const resultToAddress = !Object.values(toAddress).some(
        (value) => value === ''
      )
      if (resultToAddress) {
        setSaveToAddress(true)
      } else {
        setSaveToAddress(false)
      }
    }
    setValue((state) => {
      return { ...state, [field]: { ...state[field], [input]: value } }
    })
  }

  useEffect(() => {
    if (saveMyAddress) {
      iconRefs.current['myaddress-save'].style.color = 'rgb(71, 71, 71)'
    }
    if (saveToAddress) {
      iconRefs.current['toaddress-save'].style.color = 'rgb(71, 71, 71)'
    }
  }, [saveMyAddress, saveToAddress])

  const handleSave = async (section) => {
    switch (section) {
      case 'myaddress':
        await addUniqueRecordAddress('myAddress', myAddress)
        // await addMyAddress(indexMyAddress, myAddress)
        dispatch(addIndexMyAddress(indexMyAddress + 1))
        break
      case 'toaddress':
        await addUniqueRecordAddress('toAddress', toAddress)
        // await addToAddress(indexToAddress, toAddress)
        dispatch(addIndexToAddress(indexToAddress + 1))
        break

      default:
        break
    }
  }

  const [heightLogo, setHeightLogo] = useState(null)

  useEffect(() => {
    if (cardPuzzleRef) {
      setHeightLogo(cardPuzzleRef.clientHeight / 14)
    }
  }, [cardPuzzleRef])

  useEffect(() => {
    dispatch(addEnvelope(value))
    setChoiceSection('envelope')
  }, [dispatch, value, setChoiceSection])

  const handleMovingBetweenInputs = (e) => {
    const indexInput = Number(e.target.dataset.index)
    const field = e.target.dataset.field
    if (
      e.key === 'ArrowDown' ||
      e.keyCode === 40 ||
      e.key === 'Enter' ||
      e.keyCode === 13
    ) {
      if (indexInput < 5) {
        inputRefs.current[`${field}${indexInput + 1}`].focus()
      } else {
        inputRefs.current[`${field}${indexInput}`].focus()
      }
    }
    if (e.key === 'ArrowUp' || e.keyCode === 38) {
      console.log('*')
      if (indexInput > 1) {
        inputRefs.current[`${field}${indexInput - 1}`].focus()
      } else {
        inputRefs.current[`${field}${indexInput}`].focus()
      }
    }
  }

  const getLengthAddress = async (section) => {
    const getAllAddresses = async (storeName) => {
      switch (storeName) {
        case 'myAddress':
          return await getAllMyAddress(storeName)
        case 'toAddress':
          return await getAllToAddress(storeName)
        default:
          return []
      }
    }
    if (section === 'myaddress' || section === 'toaddress') {
      const allAddress = await getAllAddresses(section)
      if (allAddress.length > 0) {
        return true
      } else {
        return false
      }
    }
    if (section === 'length') {
      const allMyAddress = await getAllAddresses('myAddress')
      const allToAddress = await getAllAddresses('toAddress')
      return [allMyAddress.length, allToAddress.length]
    }
  }

  useEffect(() => {
    const fetchLengths = async () => {
      const lengthAddresses = await getLengthAddress('length')
      if (lengthAddresses[0] !== indexMyAddress) {
        dispatch(addIndexMyAddress(lengthAddresses[0]))
      }
      if (lengthAddresses[1] !== indexToAddress) {
        dispatch(addIndexToAddress(lengthAddresses[1]))
      }
    }
    fetchLengths()
  }, [])

  const searchParentBtnNav = (el) => {
    if (el.classList.contains('toolbar-btn')) {
      return el
    } else if (el.parentElement) {
      return searchParentBtnNav(el.parentElement)
    }
    return null
  }

  const resetStyles = (legendRef, fieldsetRef) => {
    legendRef.current.style.color = 'rgb(0, 0, 0)'
    fieldsetRef.current.style.borderColor = 'rgb(211, 211, 211)'
  }

  const applyActiveStyles = (legendRef, fieldsetRef) => {
    legendRef.current.style.color = '#007aac'
    fieldsetRef.current.style.borderColor = '#007aac'
  }

  const handleClickClip = (section) => {
    if (getLengthAddress(section)) {
      if (section === 'myaddress') {
        if (infoEnvelopeClipToAddress) {
          dispatch(infoButtons({ envelopeClipToAddress: false }))
          resetStyles(toAddressLegendRef, toAddressFieldsetRef)
        }
        if (infoEnvelopeClipMyAddress) {
          dispatch(infoButtons({ envelopeClipMyAddress: false }))
          resetStyles(myAddressLegendRef, myAddressFieldsetRef)
        } else {
          dispatch(infoButtons({ envelopeClipMyAddress: true }))
          applyActiveStyles(myAddressLegendRef, myAddressFieldsetRef)
        }
      }
      if (section === 'toaddress') {
        if (infoEnvelopeClipMyAddress) {
          dispatch(infoButtons({ envelopeClipMyAddress: false }))
          resetStyles(myAddressLegendRef, myAddressFieldsetRef)
        }
        if (infoEnvelopeClipToAddress) {
          dispatch(infoButtons({ envelopeClipToAddress: false }))
          resetStyles(toAddressLegendRef, toAddressFieldsetRef)
        } else {
          dispatch(infoButtons({ envelopeClipToAddress: true }))
          applyActiveStyles(toAddressLegendRef, toAddressFieldsetRef)
        }
      }
    }
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
      switch (section) {
        case 'myaddress':
          if (indexMyAddress > 0) {
            handleClickClip(section)
          }
          break
        case 'toaddress':
          if (indexToAddress > 0) {
            handleClickClip(section)
          }
          break
        default:
          break
      }
    }

    const changeParityInputsAddress = (section) => {
      const getSection = (section) => {
        switch (section) {
          case 'myaddress':
            return [memoryMyAddress, myAddress]
          case 'toaddress':
            return [memoryToAddress, toAddress]
          default:
            return [[], {}]
        }
      }

      getSection(section)[0].forEach((el) => {
        const arrInputs = []
        for (const key in el.address) {
          arrInputs.push(el.address[key] === getSection(section)[1][key])
        }
        if (arrInputs.every((value) => value === true)) {
          return false
        }
      })
      return true
    }

    if (parentBtn.dataset.tooltip === 'save' && section === 'myaddress') {
      if (resultMyAddress) {
        const parity = changeParityInputsAddress('myaddress')
        if (parity) {
          handleSave(section)
          getAllAddress()
        }
      }
      if (parentBtn.style.color === 'rgb(71, 71, 71)') {
        parentBtn.style.color = 'rgb(163, 163, 163)'
        parentBtn.style.cursor = 'default'
      }
    }
    if (parentBtn.dataset.tooltip === 'save' && section === 'toaddress') {
      if (resultToAddress) {
        const parity = changeParityInputsAddress('toaddress')
        if (parity) {
          handleSave(section)
          getAllAddress()
        }
      }
      if (parentBtn.style.color === 'rgb(71, 71, 71)') {
        parentBtn.style.color = 'rgb(163, 163, 163)'
        parentBtn.style.cursor = 'default'
      }
    }
    if (parentBtn.dataset.tooltip === 'delete' && section === 'myaddress') {
      clearAddress('myAddress')
    }
    if (parentBtn.dataset.tooltip === 'delete' && section === 'toaddress') {
      clearAddress('toAddress')
    }
    getAllAddress()
  }

  return (
    <div className="envelope">
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
          setIconRef={setIconRef}
          handleSave={handleSave}
          myAddressRefs={[myAddressFieldsetRef, myAddressLegendRef]}
          toAddressRefs={[toAddressFieldsetRef, toAddressLegendRef]}
          lengthAddress={[indexMyAddress, indexToAddress]}
          handleClickBtn={handleClickBtn}
          iconsMyAddress={[saveMyAddress, clipMyAddress, deleteMyAddress]}
          iconsToAddress={[saveToAddress, clipToAddress, deleteToAddress]}
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
          setIconRef={setIconRef}
          handleSave={handleSave}
          myAddressRefs={[myAddressFieldsetRef, myAddressLegendRef]}
          toAddressRefs={[toAddressFieldsetRef, toAddressLegendRef]}
          lengthAddress={[indexMyAddress, indexToAddress]}
          handleClickBtn={handleClickBtn}
          iconsMyAddress={[saveMyAddress, clipMyAddress, deleteMyAddress]}
          iconsToAddress={[saveToAddress, clipToAddress, deleteToAddress]}
        />
      </div>
    </div>
  )
}

export default Envelope
