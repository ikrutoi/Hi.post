// import { useRef } from 'react'
import './Label.scss'

const Label = ({
  name,
  valueMyAddress,
  handleValueAddress,
  valueToAddress,
  handleKeyArrow,
  setRef,
}) => {
  const indexName = name.split('-')[0]
  const nameWithoutIndex = name.split('-')[1]
  const shortName = nameWithoutIndex.split(' / ')[0].toLowerCase()
  // const validationInputRef = () => {
  //   if (valueMyAddress) {
  //     return allInputsRef.myaddress[indexName]
  //   }
  //   if (valueToAddress) {
  //     return allInputsRef.toaddress[indexName]
  //   }
  // }
  const validationHandleValueAddress = (e) => {
    e.preventDefault()

    if (e.target.className.includes('to-address')) {
      handleValueAddress('to-address', shortName, e.target.value)
    }
    if (e.target.className.includes('my-address')) {
      handleValueAddress('my-address', shortName, e.target.value)
    }
  }

  const validationValueAddress = () => {
    if (valueMyAddress) {
      return valueMyAddress[shortName]
    }
    if (valueToAddress) {
      return valueToAddress[shortName]
    }
  }
  // const inputRefs = useRef({})
  // const setRef = (id) => (element) => {
  //   inputRefs.current[id] = element
  // }

  return (
    <label
      className={`envelope-label envelope-label-${shortName.toLowerCase()}`}
    >
      {
        <>
          <span className="label-element-space"></span>
          <span>{nameWithoutIndex}</span>
          <span className="label-element-space"></span>
        </>
      }
      <input
        className={`envelope-input ${
          valueMyAddress ? `my-address my-address-${shortName}` : ''
        } ${valueToAddress ? `to-address to-address-${shortName}` : ''}`}
        ref={setRef(
          `${
            valueMyAddress ? `myaddress${indexName}` : `toaddress${indexName}`
          }`
        )}
        data-index={indexName}
        type={`${shortName.toLowerCase() === 'index' ? 'number' : 'text'}`}
        value={validationValueAddress()}
        onChange={(e) => validationHandleValueAddress(e)}
        onKeyDown={handleKeyArrow}
      ></input>
    </label>
  )
}

export default Label
