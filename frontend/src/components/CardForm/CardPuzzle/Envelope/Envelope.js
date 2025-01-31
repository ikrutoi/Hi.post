import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import listLabelsMyAddress from '../../../../data/envelope/list-labels-my-address.json'
import listLabelsToAddress from '../../../../data/envelope/list-labels-to-address.json'
import './Envelope.scss'
import { addEnvelope } from '../../../../redux/cardEdit/actionCreators'
import Mark from './Mark/Mark'
import FormAddress from './FormAddress/FormAddress'

const Envelope = ({ cardPuzzleRef }) => {
  const selectors = useSelector((state) => state.cardEdit)
  const valueEnvelope =
    selectors.envelope.myaddress === null &&
    selectors.envelope.toaddress === null
      ? {
          toaddress: { street: '', index: '', city: '', country: '', name: '' },
          myaddress: { street: '', index: '', city: '', country: '', name: '' },
        }
      : selectors.envelope

  const [value, setValue] = useState(valueEnvelope)

  const handleValue = (field, input, value) => {
    setValue((state) => {
      return { ...state, [field]: { ...state[field], [input]: value } }
    })
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
  }, [dispatch, value])

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
        />
      </div>
    </div>
  )
}

export default Envelope
