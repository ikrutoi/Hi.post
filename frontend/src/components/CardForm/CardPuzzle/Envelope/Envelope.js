import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import './Envelope.scss'
import { addEnvelope } from '../../../../redux/cardEdit/actionCreators'
import FormMyAddress from './FormMyAddress/FormMyAddress'
import FormToAddress from './FormToAddress/FormToAddress'
import Mark from './Mark/Mark'

const Envelope = () => {
  const selectors = useSelector((state) => state.cardEdit)
  const inputValueMyAddress = selectors.envelope.myaddress
    ? selectors.envelope.myaddress
    : null
  const inputValueToAddress = selectors.envelope.toaddress
    ? selectors.envelope.toaddress
    : null

  const [valueMyAddress, setValueMyAddress] = useState(
    inputValueMyAddress
      ? inputValueMyAddress
      : { street: '', index: '', city: '', country: '', name: '' }
  )
  const [valueToAddress, setValueToAddress] = useState(
    inputValueToAddress
      ? inputValueToAddress
      : { street: '', index: '', city: '', country: '', name: '' }
  )

  const [valueEnvelope, setValueEnvelope] = useState({
    myaddress: valueMyAddress,
    toaddress: valueToAddress,
  })

  const inputRefs = useRef({})
  const setRef = (id) => (element) => {
    inputRefs.current[id] = element
  }

  const dispatch = useDispatch()

  useEffect(
    () =>
      setValueEnvelope((state) => {
        return {
          ...state,
          myaddress: valueMyAddress,
          toaddress: valueToAddress,
        }
      }),
    [valueMyAddress, valueToAddress]
  )

  useEffect(() => {
    if (
      valueEnvelope.toaddress.street !== '' &&
      valueEnvelope.toaddress.index !== '' &&
      valueEnvelope.toaddress.city !== '' &&
      valueEnvelope.toaddress.country !== '' &&
      valueEnvelope.toaddress.name !== ''
    ) {
      dispatch(addEnvelope(valueEnvelope))
    }
  }, [
    valueEnvelope.toaddress.street,
    valueEnvelope.toaddress.index,
    valueEnvelope.toaddress.city,
    valueEnvelope.toaddress.country,
    valueEnvelope.toaddress.name,
    dispatch,
    valueEnvelope,
  ])

  const handleValueAddress = (field, nameAddress, value) => {
    if (field === 'to-address') {
      setValueToAddress((state) => {
        return { ...state, [`${nameAddress}`]: value }
      })
    }
    if (field === 'my-address') {
      setValueMyAddress((state) => {
        return { ...state, [`${nameAddress}`]: value }
      })
    }
  }

  const handleKeyArrow = (el) => {
    const indexInput = el.target.dataset.index
    // const validationArrow = (field, el) => {
    if (el.key === 'ArrowDown' || el.keyCode === 40) {
      if (indexInput < 5) {
        inputRefs.current['toaddress5'].focus()
      }
      // console.log('key down', el.target.dataset.index)
    }
    if (el.key === 'ArrowUp' || el.keyCode === 38) {
    }
  }

  return (
    <div className="envelope">
      <div className="envelope-my-address">
        <div className="envelope-logo">Hidragonfly.com</div>
        <FormMyAddress
          valueMyAddress={valueMyAddress}
          handleValueAddress={handleValueAddress}
          handleKeyArrow={handleKeyArrow}
          setRef={setRef}
        />
      </div>
      <Mark />
      <div className="envelope-to-address">
        <FormToAddress
          valueToAddress={valueToAddress}
          handleValueAddress={handleValueAddress}
          handleKeyArrow={handleKeyArrow}
          setRef={setRef}
        />
      </div>
    </div>
  )
}

export default Envelope
