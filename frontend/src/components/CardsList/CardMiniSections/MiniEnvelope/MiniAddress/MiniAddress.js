// import listLabelsMyAddress from '../../../../../data/envelope/list-labels-my-address.json'
// import listLabelsToAddress from '../../../../../data/envelope/list-labels-to-address.json'
import { useEffect } from 'react'
import './MiniAddress.scss'

const MiniMyAddress = ({ listLabelsAddress, values }) => {
  useEffect(() => {
    console.log('values', values)
  }, [values])
  const createAddress = () => {
    return listLabelsAddress.list.map((firstName, i) => {
      return typeof firstName === 'string' ? (
        <span
          key={`${firstName}-${i}`}
          className={`mini-${listLabelsAddress.name} mini-${
            listLabelsAddress.name
          }-${firstName.split('-')[1].toLocaleLowerCase()}`}
        >
          {values[firstName.split('-')[1].toLowerCase()]}
        </span>
      ) : (
        <span className="mini-address-two-elements">
          {firstName.map((secondName, i) => (
            <span
              key={`${secondName}-${i}`}
              className={`mini-${listLabelsAddress.name} mini-${
                listLabelsAddress.name
              }-${secondName.split('-')[1].toLocaleLowerCase()}`}
            >
              {values[secondName.split('-')[1].toLocaleLowerCase()]}
            </span>
          ))}
        </span>
      )
    })
  }
  return <>{createAddress(listLabelsAddress)}</>
}

export default MiniMyAddress
