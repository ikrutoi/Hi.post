import { useState, useEffect } from 'react'
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
      : { street: '', index: '', country: '', name: '' }
  )
  const [valueToAddress, setValueToAddress] = useState(
    inputValueToAddress
      ? inputValueToAddress
      : { street: '', index: '', country: '', name: '' }
  )

  const [valueEnvelope, setValueEnvelope] = useState({
    myaddress: valueMyAddress,
    toaddress: valueToAddress,
  })

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
      valueEnvelope.toaddress.country !== '' &&
      valueEnvelope.toaddress.name !== ''
    ) {
      dispatch(addEnvelope(valueEnvelope))
    }
  }, [
    valueEnvelope.toaddress.street,
    valueEnvelope.toaddress.index,
    valueEnvelope.toaddress.country,
    valueEnvelope.toaddress.name,
    dispatch,
    valueEnvelope,
  ])

  const handleValueMyAddress = (nameAddress, value) => {
    switch (nameAddress) {
      case 'street':
        setValueMyAddress((state) => {
          return { ...state, street: value }
        })
        break
      case 'index':
        setValueMyAddress((state) => {
          return { ...state, index: value }
        })
        break
      case 'country':
        setValueMyAddress((state) => {
          return { ...state, country: value }
        })
        break
      case 'name':
        setValueMyAddress((state) => {
          return { ...state, name: value }
        })
        break
      default:
        break
    }
  }

  const handleValueToAddress = (nameAddress, value) => {
    switch (nameAddress) {
      case 'street':
        setValueToAddress((state) => {
          return { ...state, street: value }
        })
        break
      case 'index':
        setValueToAddress((state) => {
          return { ...state, index: value }
        })
        break
      case 'country':
        setValueToAddress((state) => {
          return { ...state, country: value }
        })
        break
      case 'name':
        setValueToAddress((state) => {
          return { ...state, name: value }
        })
        break
      default:
        break
    }
  }

  return (
    <div className="envelope">
      <div className="envelope-my-address">
        <div className="envelope-logo">Hidragonfly.com</div>
        <FormMyAddress
          valueMyAddress={valueMyAddress}
          handleValueMyAddress={handleValueMyAddress}
        />
      </div>
      <Mark />
      <div className="envelope-to-address">
        <FormToAddress
          valueToAddress={valueToAddress}
          handleValueToAddress={handleValueToAddress}
        />
      </div>
    </div>
  )
}

export default Envelope
