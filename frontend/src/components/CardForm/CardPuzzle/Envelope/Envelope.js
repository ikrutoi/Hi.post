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
  const resultMyAddress = !Object.values(myAddress).some(
    (value) => value === ''
  )
  const resultToAddress = !Object.values(toAddress).some(
    (value) => value === ''
  )
  const dispatch = useDispatch()

  const getAddress = async () => {
    const myAddress = await getAllMyAddress('myAddress')
    setMemoryMyAddress(myAddress)
    const toAddress = await getAllToAddress('toAddress')
    // console.log('toAddress', toAddress)
    setMemoryToAddress(toAddress)
  }

  useEffect(() => {
    getAddress()
  }, [])

  const handleValue = (field, input, value) => {
    setValue((state) => {
      return { ...state, [field]: { ...state[field], [input]: value } }
    })
  }

  const handleSave = async (section) => {
    switch (section) {
      case 'myaddress':
        await addMyAddress(indexMyAddress, myAddress)
        dispatch(addIndexMyAddress(indexMyAddress + 1))
        break
      case 'toaddress':
        // console.log('index', indexToAddress, toAddress)
        await addToAddress(indexToAddress, toAddress)
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

  const inputRefs = useRef({})
  const setRef = (id) => (element) => {
    inputRefs.current[id] = element
  }
  const envelopeLogoRef = useRef(null)

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
    if (section === 'myaddress') {
      const allMyAddress = await getAllMyAddress('myAddress')
      if (allMyAddress.length > 0) {
        return true
      } else {
        return false
      }
    }
    if (section === 'toaddress') {
      const allToAddress = await getAllToAddress('toAddress')
      if (allToAddress.length > 0) {
        return true
      } else {
        return false
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

  const handleClickClip = (section) => {
    if (getLengthAddress(section)) {
      if (section === 'myaddress') {
        if (infoEnvelopeClipToAddress) {
          dispatch(infoButtons({ envelopeClipToAddress: false }))
          toAddressLegendRef.current.style.color = 'rgb(0, 0 , 0)'
          toAddressFieldsetRef.current.style.borderColor = 'rgb(211, 211 , 211)'
        }
        if (infoEnvelopeClipMyAddress) {
          dispatch(infoButtons({ envelopeClipMyAddress: false }))
          myAddressLegendRef.current.style.color = 'rgb(0, 0 , 0)'
          myAddressFieldsetRef.current.style.borderColor = 'rgb(211, 211 , 211)'
        } else {
          dispatch(infoButtons({ envelopeClipMyAddress: true }))
          myAddressLegendRef.current.style.color = '#007aac'
          myAddressFieldsetRef.current.style.borderColor = '#007aac'
        }
      }
      if (section === 'toaddress') {
        if (infoEnvelopeClipMyAddress) {
          dispatch(infoButtons({ envelopeClipMyAddress: false }))
          myAddressLegendRef.current.style.color = 'rgb(0, 0 , 0)'
          myAddressFieldsetRef.current.style.borderColor = 'rgb(211, 211 , 211)'
        }
        if (infoEnvelopeClipToAddress) {
          dispatch(infoButtons({ envelopeClipToAddress: false }))
          toAddressLegendRef.current.style.color = 'rgb(0, 0 , 0)'
          toAddressFieldsetRef.current.style.borderColor = 'rgb(211, 211 , 211)'
        } else {
          dispatch(infoButtons({ envelopeClipToAddress: true }))
          toAddressLegendRef.current.style.color = '#007aac'
          toAddressFieldsetRef.current.style.borderColor = '#007aac'
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
      handleClickClip(section)
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
        console.log('parity myaddress', parity)
        if (parity) {
          handleSave(section)
        }
      }
      if (parentBtn.style.color === 'rgb(71, 71, 71)') {
        parentBtn.style.color = 'rgb(163, 163, 163)'
        parentBtn.style.cursor = 'default'
      }
    }
    if (parentBtn.dataset.tooltip === 'save' && section === 'toaddress') {
      console.log('toAddress0', resultToAddress)
      if (resultToAddress) {
        const parity = changeParityInputsAddress('toaddress')
        console.log('parity', parity)
        if (parity) {
          handleSave(section)
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
    getAddress()
  }

  // const btnRefs = useRef()

  // const handleRef = (name) => (element) => {
  //   btnRefs.current[name] = element
  // }

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
          setRef={setRef}
          handleSave={handleSave}
          myAddressLegendRef={myAddressLegendRef}
          toAddressLegendRef={toAddressLegendRef}
          myAddressFieldsetRef={myAddressFieldsetRef}
          toAddressFieldsetRef={toAddressFieldsetRef}
          // handleRef={handleRef}
          handleClickBtn={handleClickBtn}
        />
      </div>
      <Mark />
      <div className="envelope-toaddress">
        <FormAddress
          values={value}
          listLabelsAddress={{ list: listLabelsToAddress, name: 'toaddress' }}
          handleValue={handleValue}
          handleMovingBetweenInputs={handleMovingBetweenInputs}
          setRef={setRef}
          handleSave={handleSave}
          myAddressLegendRef={myAddressLegendRef}
          toAddressLegendRef={toAddressLegendRef}
          myAddressFieldsetRef={myAddressFieldsetRef}
          toAddressFieldsetRef={toAddressFieldsetRef}
          // handleRef={handleRef}
          handleClickBtn={handleClickBtn}
        />
      </div>
    </div>
  )
}

export default Envelope
