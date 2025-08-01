import React from 'react'
import './MiniAddress.scss'

const MiniAddress = ({ listLabelsAddress, values }) => {
  const createAddress = () => {
    return listLabelsAddress.list.map((firstName, i) => {
      return typeof firstName === 'string' ? (
        <span
          key={`${firstName}-${i}`}
          className={`mini-${listLabelsAddress.name} mini-${
            listLabelsAddress.name
          }-${firstName.split('-')[1].split(' / ')[0].toLocaleLowerCase()}`}
        >
          {values[firstName.split('-')[1].split(' / ')[0].toLocaleLowerCase()]}
        </span>
      ) : (
        <span
          className="mini-address-two-elements"
          key={`${listLabelsAddress.name}-${i}`}
        >
          {firstName.map((secondName, j) => (
            <span
              key={`${secondName}-${i}-${j}}`}
              className={`mini-${listLabelsAddress.name} mini-${
                listLabelsAddress.name
              }-${secondName
                .split('-')[1]
                .split(' / ')[0]
                .toLocaleLowerCase()}`}
            >
              {
                values[
                  secondName.split('-')[1].split(' / ')[0].toLocaleLowerCase()
                ]
              }
            </span>
          ))}
        </span>
      )
    })
  }
  return <>{createAddress(listLabelsAddress)}</>
}

export default MiniAddress
