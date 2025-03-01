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
  addToAddress,
  getToAddress,
  deleteToAddress,
} from '../../../../utils/cardFormNav/indexDB/indexDb'
import { addChoiceSection } from '../../../../redux/layout/actionCreators'
import {
  addIndexMyAddress,
  addIndexToAddress,
} from '../../../../redux/layout/actionCreators'

const Envelope = ({ cardPuzzleRef, setChoiceSection }) => {
  const selectorCardEdit = useSelector((state) => state.cardEdit)
  const myAddress = useSelector((state) => state.cardEdit.envelope.myaddress)
  const toAddress = useSelector((state) => state.cardEdit.envelope.toaddress)
  const indexMyAddress = useSelector((state) => state.layout.indexMyAddress)
  const indexToAddress = useSelector((state) => state.layout.indexToAddress)
  const valueEnvelope =
    selectorCardEdit.envelope.myaddress === null &&
    selectorCardEdit.envelope.toaddress === null
      ? {
          toaddress: { street: '', index: '', city: '', country: '', name: '' },
          myaddress: { street: '', index: '', city: '', country: '', name: '' },
        }
      : selectorCardEdit.envelope

  const [value, setValue] = useState(valueEnvelope)

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

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(addEnvelope(value))
    setChoiceSection('envelope')
    // dispatch(
    //   addChoiceSection({ source: 'cardPuzzle', nameSection: 'envelope' })
    // )
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
      console.log('*')
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
        />
      </div>
    </div>
  )
}

export default Envelope
